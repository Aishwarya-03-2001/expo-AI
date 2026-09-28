import React, { useRef, useEffect, useState } from 'react';
import { Camera, CreditCard, UserPlus, Calendar, X, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';

interface CameraOverlayProps {
  onScanCard: (capturedImageData?: string) => void;
  onTakePhoto: (capturedImageData?: string) => void;
  onNewLead: () => void;
  onScheduleMeeting: () => void;
  onDismiss: () => void;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  onScanCard,
  onTakePhoto,
  onNewLead,
  onScheduleMeeting,
  onDismiss,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err: any) {
        console.warn('Webcam permission denied or not available:', err);
        setCameraError('Camera simulation active (Webcam unavailable in iframe environment)');
        setCameraActive(false);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const captureFrame = (): string | undefined => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }
    return undefined;
  };

  const handleScanCardClick = () => {
    const frame = captureFrame();
    onScanCard(frame);
  };

  const handleTakePhotoClick = () => {
    const frame = captureFrame();
    onTakePhoto(frame);
  };

  return (
    <div className="relative w-full h-[320px] md:h-[380px] bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 shadow-xl group">
      {/* Live Camera Video or Simulation Viewfinder */}
      {cameraActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          <h4 className="text-white font-semibold text-base mb-1">ADIPEC Exhibition Camera Active</h4>
          <p className="text-slate-400 text-xs max-w-md mb-2">
            Position business card or visitor in viewfinder to quickly capture lead data in &lt; 2 mins.
          </p>
          {cameraError && (
            <span className="text-[11px] text-blue-300 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700/50">
              {cameraError}
            </span>
          )}
        </div>
      )}

      {/* Frame Focus Guides / Corner Overlays */}
      <div className="absolute inset-8 pointer-events-none border-2 border-white/20 rounded-xl flex flex-col justify-between p-2">
        <div className="flex justify-between">
          <div className="w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
          <div className="w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
        </div>
        <div className="flex justify-between">
          <div className="w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
          <div className="w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
        </div>
      </div>

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>ExpoConnect AI Scanner</span>
        </div>

        <div className="flex items-center gap-1.5">
          {cameraActive && (
            <button
              onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')}
              className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition-colors"
              title="Flip Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white hover:bg-red-600/80 transition-colors"
            title="Dismiss Camera View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Glassmorphism Overlay Bar at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-2 z-10 shadow-2xl">
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={handleScanCardClick}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all transform active:scale-95 shadow-lg shadow-blue-600/30"
          >
            <CreditCard className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold tracking-tight text-center leading-none">Scan Card</span>
          </button>

          <button
            onClick={handleTakePhotoClick}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 transition-all transform active:scale-95"
          >
            <Camera className="w-5 h-5 mb-1 text-sky-400" />
            <span className="text-[11px] font-semibold tracking-tight text-center leading-none">Take Photo</span>
          </button>

          <button
            onClick={onNewLead}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 transition-all transform active:scale-95"
          >
            <UserPlus className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="text-[11px] font-semibold tracking-tight text-center leading-none">New Lead</span>
          </button>

          <button
            onClick={onScheduleMeeting}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 transition-all transform active:scale-95"
          >
            <Calendar className="w-5 h-5 mb-1 text-amber-400" />
            <span className="text-[11px] font-semibold tracking-tight text-center leading-none">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
