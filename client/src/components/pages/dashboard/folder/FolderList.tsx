import { FolderCard } from "./folder-card/FolderCard";

const folders = [
  { id: 1, name: "Documents" },
  { id: 2, name: "Projects" },
  { id: 3, name: "Settings" },
];

interface FolderListProps {
  onContextMenu: (e: React.MouseEvent, folderId: number) => void;
}

const FolderList = ({ onContextMenu }: FolderListProps) => {
  return (
    <>
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          name={folder.name}
          onClick={() => console.log("Clicked:", folder.name)}
          onContextMenu={(e) => onContextMenu(e, folder.id)}
        />
      ))}
    </>
  );
};

export default FolderList;
