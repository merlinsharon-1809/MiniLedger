import { Router, Request, Response } from 'express';

const router = Router();

// Mock endpoints – full implementation will be added later
router.post('/send-otp', (req: Request, res: Response) => {
  res.status(200).json({ message: 'OTP sent (mock)' });
});

router.post('/verify-otp', (req: Request, res: Response) => {
  // In real flow, would generate JWT. Here we just return a placeholder token.
  res.status(200).json({ token: 'mock-jwt-token', user: { phoneNumber: req.body.phoneNumber } });
});

router.get('/me', (req: Request, res: Response) => {
  // Placeholder user info – would be extracted from JWT in real implementation.
  res.status(200).json({ id: 'user-id-placeholder', phoneNumber: '+919876543210' });
});

export default router;
