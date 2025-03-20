import React, { useState } from "react";

const TreeNode = ({ node, handleUpdate, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleRename = () => {
    const newName = prompt("Enter new name:", node.name);
    if (newName && newName.trim() !== "" && newName !== node.name) {
      handleUpdate(node._id, newName, node.parentId);
    }
  };

  return (
    <li>
      <div>
        {node.children.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? "▼" : "▶"}
          </button>
        )}
        <span>{node.name}</span>
        <button onClick={handleRename}>Edit</button>
        <button onClick={() => handleDelete(node._id)}>Delete</button>
      </div>
      {expanded && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              handleUpdate={handleUpdate}  // Pass down update function
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
