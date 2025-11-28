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
  { title: 'Arduino', iconType: 'arduino' },
];

export const TechToolbox = () => {
  return (
    <div className="toolbox-vertical-container">
      <ToolboxItems
        items={toolboxItems1}
        itemsWraperClassName="animate-move-up"
        animationDuration={'25s'}
        vertical
        column="left"
      />

      <ToolboxItems
        items={toolboxItems2}
        itemsWraperClassName="animate-move-down"
        animationDuration={'25s'}
        vertical
        column="right"
      />
    </div>
  );
};
