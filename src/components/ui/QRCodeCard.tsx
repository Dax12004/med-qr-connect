
import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeCardProps {
  data: string;
  title: string;
  description?: string;
  className?: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  data,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-medical-dark mb-4">{title}</h3>
      
      <div className="flex flex-col items-center justify-center space-y-4 mb-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <QRCodeSVG
            value={data}
            size={200}
            level="H" // High error correction capability
            imageSettings={{
              src: "/public/favicon.ico",
              excavate: true,
              height: 24,
              width: 24,
            }}
          />
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 text-center">{description}</p>
        )}
      </div>
      
      <div className="flex justify-center space-x-2">
        <button 
          onClick={() => {
            const canvas = document.createElement("canvas");
            const svg = document.querySelector(`[data-value="${data}"]`) as SVGSVGElement;
            
            if (svg) {
              const serializer = new XMLSerializer();
              const svgStr = serializer.serializeToString(svg);
              
              const img = new Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0);
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.download = `qr-code-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
                  a.href = url;
                  a.click();
                }
              };
              img.src = `data:image/svg+xml;base64,${btoa(svgStr)}`;
            }
          }}
          className="text-sm px-4 py-2 bg-medical-primary text-white rounded hover:bg-medical-secondary transition-colors"
        >
          Download
        </button>
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(data);
            alert("QR code data copied to clipboard");
          }}
          className="text-sm px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
        >
          Copy Data
        </button>
      </div>
    </div>
  );
};

export default QRCodeCard;
