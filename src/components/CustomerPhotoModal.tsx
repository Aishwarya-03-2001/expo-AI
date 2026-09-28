import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Check, RefreshCw, UserCheck } from 'lucide-react';
import { Lead } from '../types';

interface CustomerPhotoModalProps {
  leads: Lead[];
  initialImage?: string;
  onClose: () => void;
  onAttachPhoto: (leadId: string, photoUrl: string, setAsCover: boolean) => void;
}

export const CustomerPhotoModal: React.FC<CustomerPhotoModalProps> = ({
  leads,
  initialImage,
  onClose,
  onAttachPhoto,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialImage || null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [setAsCover, setSetAsCover] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (!initialImage) {
      async function startCam() {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (e) {
          console.warn('Camera stream error:', e);
        }
      }
      startCam();
    }
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [initialImage]);

  const snapPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL('image/jpeg', 0.85));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (photoUrl && selectedLeadId) {
      onAttachPhoto(selectedLeadId, photoUrl, setAsCover);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Attach Customer Selfie / Photo</h3>
              <p className="text-slate-500 text-xs">Link booth photos to lead profiles and timeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Viewfinder or Photo Preview */}
          <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
            {photoUrl ? (
              <div className="relative w-full h-full">
                <img src={photoUrl} alt="Captured" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">No live video feed. Upload a photo or sample below:</p>
                <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer">
                  Browse File
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Snap trigger */}
          {!photoUrl && cameraActive && (
            <button
              onClick={snapPhoto}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo Now</span>
            </button>
          )}

          {/* Select Lead & Cover Checkbox */}
          {photoUrl && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-500" /> Select Lead to Link Photo
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.company}) - {l.potential}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsCover}
                  onChange={(e) => setSetAsCover(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span>Set as primary lead cover image</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!photoUrl || !selectedLeadId}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Photo to Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
