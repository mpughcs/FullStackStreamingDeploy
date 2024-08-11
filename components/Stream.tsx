import React from "react";

interface IframeComponentProps {
  src: string;
  width?: string;
  height?: string;
  title: string;
  isStreaming: boolean; // Add a prop to control visibility
}

const Stream: React.FC<IframeComponentProps> = ({
  src,
  width = "100%",
  height = "500px",
  title,
  isStreaming,
}) => {
  if (!isStreaming) {
    return (
      <div className="w-full h-[500px] bg-black text-white flex items-center justify-center">
        <p>Stream is offline</p>
      </div>
    );
    
  }

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      title={title}
      style={{ border: "none" }}
      allowFullScreen
    />
  );
};

export default Stream;
