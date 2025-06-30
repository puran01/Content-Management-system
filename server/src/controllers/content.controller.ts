import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Content } from '../entities/Content';
import { validate } from 'class-validator';

const contentRepository = AppDataSource.getRepository(Content);

export const createContent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { title, body, status = 'draft' } = req.body;
        const content = new Content();
        content.title = title;
        content.body = body;
        content.status = status;
        content.author = req.user;
        content.authorId = req.user.id;

        const errors = await validate(content);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        await contentRepository.save(content);
        res.status(201).json(content);
    } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({ message: 'Error creating content' });
    }
};

export const getContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const content = await contentRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['author']
        });
        
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        res.json(content);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ message: 'Error retrieving content' });
    }
};

export const updateContent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { id } = req.params;
        const content = await contentRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['author']
        });
        
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check if user is the author or admin
        if (content.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this content' });
        }

        // Update fields
        if (req.body.title) content.title = req.body.title;
        if (req.body.body) content.body = req.body.body;
        if (req.body.status) content.status = req.body.status;

        const errors = await validate(content);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        await contentRepository.save(content);
        res.json(content);
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ message: 'Error updating content' });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { id } = req.params;
        const content = await contentRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['author']
        });
        
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check if user is the author or admin
        if (content.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this content' });
        }

        await contentRepository.remove(content);
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ message: 'Error deleting content' });
    }
};

export const listContent = async (req: Request, res: Response) => {
    try {
        const { status, authorId } = req.query;
        const query = contentRepository.createQueryBuilder('content')
            .leftJoinAndSelect('content.author', 'author')
            .select([
                'content',
                'author.id',
                'author.email'
            ]);

        if (status) {
            query.andWhere('content.status = :status', { status });
        }

        if (authorId) {
            query.andWhere('content.authorId = :authorId', { authorId });
        }

        // If not admin, only show published content or user's own content
        if (!req.user || req.user.role !== 'admin') {
            if (req.user) {
                query.andWhere('(content.status = :publishedStatus OR content.authorId = :userId)', {
                    publishedStatus: 'published',
                    userId: req.user.id
                });
            } else {
                query.andWhere('content.status = :status', { status: 'published' });
            }
        }

        const contents = await query.getMany();
        res.json(contents);
    } catch (error) {
        console.error('List content error:', error);
        res.status(500).json({ message: 'Error retrieving content list' });
    }
};
