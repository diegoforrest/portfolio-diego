import { ToolboxItems } from './ToolboxItems';

const toolboxItems1 = [
  { title: 'React', iconType: 'react' },
  { title: 'JavaScript', iconType: 'javascript' },
  { title: 'Node.js', iconType: 'nodejs' },
  { title: 'Next.js', iconType: 'nextjs' },
  { title: 'Tailwind', iconType: 'tailwind' },
  { title: 'Git', iconType: 'git' },
  { title: 'GitHub', iconType: 'github' },
  { title: 'HTML5', iconType: 'html5' },
  { title: 'CSS3', iconType: 'css3' },
];

const toolboxItems2 = [
  { title: 'Python', iconType: 'python' },
  { title: 'MySQL', iconType: 'mysql' },
  { title: 'Java', iconType: 'java' },
  { title: 'C#', iconType: 'csharp' },
  { title: 'PHP', iconType: 'php' },
  { title: 'Nest.js', iconType: 'nestjs' },
  { title: 'C++', iconType: 'c-plusplus' },
  { title: 'Figma', iconType: 'figma' },
];

export const TechToolbox = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToolboxItems
        items={toolboxItems1}
        itemsWraperClassName="animate-move-left"
        animationDuration={'28s'}
      />

      <ToolboxItems
        items={toolboxItems2}
        itemsWraperClassName="animate-move-right"
        animationDuration={'20s'}
      />
    </div>
  );
};
