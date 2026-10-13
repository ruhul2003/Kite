import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// Curated seed data for initial launch if database has no jobs
const SEED_JOBS = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    isRemote: true,
    type: 'Full-time',
    experience: 'Senior Level',
    salary: '$160,000 - $210,000 / yr',
    description: 'We are seeking a Senior Frontend Engineer to build world-class financial interfaces. You will architect high-performance, accessible React applications used by millions of merchants and developers globally.',
    requirements: [
      '5+ years building production web applications in React / TypeScript',
      'Deep understanding of web performance, browser APIs, and accessibility (a11y)',
      'Experience with modern state management, component libraries, and testing suites',
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Web Performance'],
    poster: {
      id: 'recruiter-stripe-1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      email: 'elena@stripe.com',
    },
    applicants: [],
  },
  {
    title: 'Fullstack Product Developer',
    company: 'Vercel',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    location: 'Remote',
    isRemote: true,
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '$140,000 - $180,000 / yr',
    description: 'Join the product team at Vercel to shape the frontend cloud. You will work across the full stack with Next.js, Node.js, and edge computing to deliver frictionless developer experiences.',
    requirements: [
      '3+ years fullstack JavaScript/TypeScript experience',
      'Hands-on experience with Next.js App Router and server-side rendering',
      'Familiarity with serverless runtimes, relational databases, and edge caching',
    ],
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Serverless'],
    poster: {
      id: 'recruiter-vercel-1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'marcus@vercel.com',
    },
    applicants: [],
  },
  {
    title: 'Product Designer (UI/UX)',
    company: 'Linear',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    isRemote: true,
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '$130,000 - $165,000 / yr',
    description: 'Design craft-driven software that high-performing teams love. You will define end-to-end user flows, refine micro-interactions, and contribute directly to our design system.',
    requirements: [
      'Proven portfolio showcasing deep craft in web and desktop application UI/UX',
      'Proficiency in Figma, design systems, interactive prototypes, and typography',
      'Ability to collaborate closely with engineers and translate design into production specs',
    ],
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design'],
    poster: {
      id: 'recruiter-linear-1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'sarah@linear.app',
    },
    applicants: [],
  },
  {
    title: 'Cloud DevOps & Infrastructure Engineer',
    company: 'GitHub',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    location: 'Remote',
    isRemote: true,
    type: 'Full-time',
    experience: 'Senior Level',
    salary: '$155,000 - $195,000 / yr',
    description: 'Maintain and scale mission-critical developer infrastructure powering tens of millions of developers. You will design resilient CI/CD pipelines, container orchestration, and observability clusters.',
    requirements: [
      '4+ years managing cloud infrastructure on AWS, Azure, or GCP',
      'Strong expertise with Kubernetes, Docker, Terraform, and GitHub Actions',
      'Solid scripting skills in Python, Go, or Bash and background in site reliability',
    ],
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
    poster: {
      id: 'recruiter-github-1',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'alex@github.com',
    },
    applicants: [],
  },
];

// GET /api/jobs - List all jobs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, type, remote, experience } = req.query;

    let count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(SEED_JOBS);
    }

    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { description: regex },
        { skills: regex },
      ];
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (experience && experience !== 'All') {
      filter.experience = experience;
    }

    if (remote === 'true') {
      filter.isRemote = true;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch job listings' });
  }
});

// POST /api/jobs - Recruiter creates a new job
router.post('/', async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      location,
      isRemote,
      type,
      experience,
      salary,
      description,
      requirements,
      skills,
      poster,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, company, location, and description are required',
      });
    }

    const newJob = await Job.create({
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      location: location.trim(),
      isRemote: Boolean(isRemote),
      type: type || 'Full-time',
      experience: experience || 'Mid Level',
      salary: salary?.trim() || 'Competitive',
      description: description.trim(),
      requirements: Array.isArray(requirements) ? requirements : requirements ? [requirements] : [],
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      poster: poster || {
        id: 'user-recruiter-default',
        name: 'Hiring Team',
      },
      applicants: [],
    });

    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create job posting' });
  }
});

// GET /api/jobs/:id - Single job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch job details' });
  }
});

// POST /api/jobs/:id/apply - Seeker applies to a job
router.post('/:id/apply', async (req, res) => {
  try {
    const { userId, name, email, phone, resumeUrl, coverNote } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Applicant name and email are required',
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if user already applied
    const alreadyApplied = job.applicants.some(
      (a) => (userId && a.userId === userId) || a.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this position.',
      });
    }

    job.applicants.push({
      userId,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      resumeUrl: resumeUrl?.trim(),
      coverNote: coverNote?.trim(),
      appliedAt: new Date(),
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully!',
      job,
    });
  } catch (err) {
    console.error('Error applying to job:', err.message);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
});

// DELETE /api/jobs/:id - Recruiter deletes a job posting
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete job' });
  }
});

export default router;
