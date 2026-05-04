export interface AnimationItem {
  id: number;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  codeSnippet: string;
  sourceUrl?: string;
  previewType?: 'iframe' | 'image' | 'none';
  previewUrl?: string | null;
}
