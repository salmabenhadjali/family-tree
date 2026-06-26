import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Person from '../models/Person';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 800, height: 800, crop: 'limit' }] },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const people = await Person.find()
      .populate('parents', 'firstName lastName photo')
      .populate('spouses', 'firstName lastName photo')
      .populate('children', 'firstName lastName photo')
      .lean();
    res.json(people);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getOne(req: AuthRequest, res: Response) {
  try {
    const person = await Person.findById(req.params.id)
      .populate('parents', 'firstName lastName photo gender birthDate')
      .populate('spouses', 'firstName lastName photo gender birthDate')
      .populate('children', 'firstName lastName photo gender birthDate');
    if (!person) return res.status(404).json({ message: 'Person not found' });
    res.json(person);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const data = { ...req.body, addedBy: req.user!.id };

    if (req.file) {
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'family-tree');
      data.photo = url;
      data.photoPublicId = publicId;
    }

    const person = await Person.create(data);

    // Link bidirectional relationships
    if (data.parents?.length) {
      await Person.updateMany(
        { _id: { $in: data.parents } },
        { $addToSet: { children: person._id } }
      );
    }
    if (data.children?.length) {
      await Person.updateMany(
        { _id: { $in: data.children } },
        { $addToSet: { parents: person._id } }
      );
    }
    if (data.spouses?.length) {
      await Person.updateMany(
        { _id: { $in: data.spouses } },
        { $addToSet: { spouses: person._id } }
      );
    }

    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    const data = { ...req.body };

    if (req.file) {
      if (person.photoPublicId) {
        await cloudinary.uploader.destroy(person.photoPublicId);
      }
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'family-tree');
      data.photo = url;
      data.photoPublicId = publicId;
    }

    Object.assign(person, data);
    await person.save();
    res.json(person);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    if (person.photoPublicId) {
      await cloudinary.uploader.destroy(person.photoPublicId);
    }

    // Remove from all relationship arrays
    await Person.updateMany(
      { $or: [{ parents: person._id }, { children: person._id }, { spouses: person._id }] },
      { $pull: { parents: person._id, children: person._id, spouses: person._id } }
    );

    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function search(req: AuthRequest, res: Response) {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const people = await Person.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();
    res.json(people);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
