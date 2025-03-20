import React, { useState } from "react";

const TreeNode = ({ node, handleUpdate, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {node.children.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? "▼" : "▶"}
          </button>
        )}

        <span>{node.name}</span>

        <button onClick={() => handleUpdate(node._id, prompt("New Name:", node.name))}>
          Edit
        </button>

        <button onClick={() => handleDelete(node._id)}>Delete</button>
      </div>

      {expanded && node.children.length > 0 && (
        <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
          {node.children.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
