import { cn } from "../../lib/utils";

// DentaCare Blue Color Palette
const colors = {
  primary: '#94D7BC',
  primarySoft: '#D0E4FF',
  primaryDeep: '#091E5D',
  accent: '#D8EE53',
  border: '#E2EBEA',
};

export const GridGradientBg = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Blue Gradient Right Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 800px at 100% 200px, ${colors.primarySoft}, transparent)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {children}
    </div>
  );
};

export const DualGradientBg = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Dual Gradient Overlay (Bottom) Background  */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 500px at 20% 100%, ${colors.primary}30, transparent),
            radial-gradient(circle 500px at 100% 80%, ${colors.primary}40, transparent)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {children}
    </div>
  );
};

export const DeepBlueGridBg = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Deep Blue Radial Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at 0% 50%, ${colors.primarySoft}40, transparent),
            radial-gradient(circle 600px at 100% 80%, ${colors.primary}30, transparent)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {children}
    </div>
  );
};

export const SoftGridBg = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Soft Radial Glow*/}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 400px at 50% 50%, ${colors.primarySoft}30, transparent)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {children}
    </div>
  );
};

export const GradientBg = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Soft Blue Gradient Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colors.primarySoft}20 0%, #FFFFFF 50%, ${colors.primarySoft}20 100%)`,
        }}
      />
      {children}
    </div>
  );
};

export default { 
  GridGradientBg, 
  DualGradientBg, 
  DeepBlueGridBg, 
  SoftGridBg,
  GradientBg 
};