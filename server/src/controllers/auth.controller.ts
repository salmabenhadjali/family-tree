import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';

function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({
      name,
      email,
      password,
      role: isFirst ? 'admin' : 'viewer',
      isVerified: isFirst,
    });

    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function inviteUser(req: Request, res: Response) {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: 'User already exists' });

    const inviteToken = crypto.randomBytes(32).toString('hex');
    user = await User.create({
      name,
      email,
      role: 'editor',
      inviteToken,
      inviteTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isVerified: false,
    });

    // In production: send email with invite link containing the token
    const inviteLink = `${process.env.CLIENT_URL}/accept-invite?token=${inviteToken}`;
    res.json({ message: 'Invite created', inviteLink });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function acceptInvite(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      inviteToken: token,
      inviteTokenExpiry: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired invite' });

    user.password = password;
    user.isVerified = true;
    user.inviteToken = undefined;
    user.inviteTokenExpiry = undefined;
    await user.save();

    const jwtToken = signToken(user._id.toString());
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
