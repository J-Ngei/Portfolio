// Main schema exports
import { profile1 } from './profile/profile1';
import { project } from './projects/project';
import { projectPage } from './projects/projectPage';
import { research } from './research/research';
import blogPost from './blog/blogPost';
import blogContentBlock from './blog/blogContentBlock';
import category from './blog/category';
import { thoughts } from './blog/thoughts';
import codeBlock from './codeBlock';
import { about } from './about/about';
import contact from './contact/contact';
import blockContent from './blockContent';

export const schemaTypes = [
  // Base types
  blockContent,
  codeBlock,
  
  // Profile
  profile1,
  
  // Projects
  projectPage,
  project,
  
  // Blog
  blogPost,
  blogContentBlock,
  category,
  thoughts,
  
  // Other
  research,
  about,
  contact
];
