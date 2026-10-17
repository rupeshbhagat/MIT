import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Sliders, 
  MapPin, 
  Check, 
  Camera, 
  Layers, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { FILTER_PRESETS } from '../data/mockData';
import { PhotoFilterType, StudentUser, UniversityDepartment, CampusPost } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FilterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser;
  onPublishPost: (newPost: Omit<CampusPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => void;
}

const FUN_CAMPUS_STICKERS = [
  '🎓 MIT ADT Pune',
  '🌅 Dome Sunset',
  '💻 HackMIT 2026',
  '✨ Design Wizard',
  '🤖 Robocon Lead',
  '☕ Rajbaug Cafe Vibe'
];

const CAMPUS_PRESETS = [
  {
    name: "Rajbaug Vishwashanti Dome",
    url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    location: "Rajbaug Central Dome, Pune"
  },
  {
    name: "Computing & Hackathon Lab",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    location: "Swami Vivekananda Block"
  },
  {
    name: "IOD Design Studio",
    url: "https://images.unsplash.com/photo-1581291518655-9523c932ecae?auto=format&fit=crop&w=1200&q=80",
    location: "MIT Institute of Design Wing"
  },
  {
    name: "Robotics & MakerSpace",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    location: "Mechatronics Lab 4"
  },
  {
    name: "Persona Fest Stage",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    location: "Grand Amphitheater"
  },
  {
    name: "Bio-Nano Science Lab",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    location: "School of Bioengineering"
  }
];

const UNIVERSITY_DEPTS: UniversityDepartment[] = [
  'School of Computing',
  'MIT Institute of Design (IOD)',
  'School of Engineering & Tech',
  'School of Bioengineering',
  'MIT College of Management',
  'School of Film & Media (ISBJ)',
  'School of Architecture & Planning',
  'Vishwashanti Sangeet Kala'
];

export const FilterStudioModal: React.FC<FilterStudioModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishPost,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(CAMPUS_PRESETS[0].url);
  const [activeFilter, setActiveFilter] = useState<PhotoFilterType>('clarendon');
  const [selectedDept, setSelectedDept] = useState<UniversityDepartment>(currentUser.department);
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>(CAMPUS_PRESETS[0].location);
  const [showSliders, setShowSliders] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [warmth, setWarmth] = useState<number>(0);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [selectedSticker, setSelectedSticker] = useState<string | null>('🎓 MIT ADT Pune');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playCameraShutter();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setLocation("Rajbaug Campus, Pune");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getCombinedFilterStyle = () => {
    const preset = FILTER_PRESETS.find(f => f.id === activeFilter);
    const baseFilter = preset && preset.cssFilter !== 'none' ? preset.cssFilter : '';
    const customFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%)`;
    return `${baseFilter} ${customFilter}`.trim();
  };

  const handlePublish = () => {
    sound.playCameraShutter();
    // Extract hashtags
    const matchedTags = caption.match(/#[a-zA-Z0-9_]+/g) || ['#MITADTPune', `#${selectedDept.replace(/\s+/g, '')}`];
    
    onPublishPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorDept: currentUser.department,
      mediaUrl: selectedImage,
      filterName: activeFilter,
      filterCustomStyle: getCombinedFilterStyle(),
      caption: caption || `Campus moments at ${selectedDept} ✨`,
      departmentTag: selectedDept,
      tags: Array.from(new Set(matchedTags)),
      campusLocation: location,
    });

    // Reset and close
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Studio Top Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#8B0000] via-[#9B111E] to-[#0B2545] text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Filter Studio & Post
              </h2>
              <p className="text-[10px] text-amber-200/90">Exclusive for MIT ADT University</p>
            </div>
          </div>

          <button
            onClick={handlePublish}
            className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Share Post
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Photo Preview Screen with Active Filter */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: getCombinedFilterStyle() }}
            />

            {/* University Watermark Stamp */}
            {showWatermark && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                MIT ADT PUNE
              </div>
            )}

            {/* Active Filter Overlay Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{FILTER_PRESETS.find(f => f.id === activeFilter)?.name || 'Filter'}</span>
            </div>

            {/* Active Campus Sticker Badge */}
            {selectedSticker && (
              <div className="absolute bottom-12 left-3 bg-[#8B0000]/90 backdrop-blur-md text-amber-200 px-2.5 py-1 rounded-xl text-xs font-black border border-amber-300/40 shadow-lg animate-in zoom-in-75">
                {selectedSticker}
              </div>
            )}

            {/* Change Photo Floating Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={() => setShowSliders(!showSliders)}
                className={`p-2 rounded-full backdrop-blur-md text-xs font-medium transition-colors ${
                  showSliders ? 'bg-amber-400 text-slate-900' : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                title="Fine-tune adjustments"
              >
                <Sliders className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs transition-colors"
                title="Upload from device"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Fine-Tuning Sliders Drawer */}
          {showSliders && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Filter Tone Controls</span>
                <button
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                    setWarmth(0);
                  }}
                  className="text-[10px] text-[#8B0000] hover:underline flex items-center gap-0.5"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Warmth</span>
                    <span>{warmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instagram-style Filter Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#8B0000]" />
                Choose Photo Filter
              </label>
              <span className="text-[10px] text-slate-500">12 Instagram Styles</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveFilter(preset.id)}
                  className={`flex flex-col items-center shrink-0 w-20 group transition-all ${
                    activeFilter === preset.id ? 'scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-xs ${
                      activeFilter === preset.id
                        ? 'border-[#8B0000] ring-2 ring-[#8B0000]/30'
                        : 'border-slate-200 group-hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={selectedImage}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      style={{ filter: preset.cssFilter }}
                    />
                  </div>
                  <span
                    className={`text-[11px] mt-1 truncate w-full text-center font-medium ${
                      activeFilter === preset.id
                        ? 'text-[#8B0000] font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fun Campus Stickers Row */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Add Campus Sticker
              </span>
              {selectedSticker && (
                <button
                  type="button"
                  onClick={() => setSelectedSticker(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                >
                  Remove sticker
                </button>
              )}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {FUN_CAMPUS_STICKERS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedSticker(selectedSticker === stk ? null : stk);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                    selectedSticker === stk
                      ? 'bg-[#8B0000] text-amber-300 border-amber-300 shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Campus Photo Presets */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              Pick Campus Location Scene
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CAMPUS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setLocation(preset.location);
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 text-left group transition-all ${
                    selectedImage === preset.url
                      ? 'border-[#8B0000] ring-2 ring-[#8B0000]/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] text-white font-medium truncate leading-tight">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Department Tag Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0B2545]" />
              Tag University Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as UniversityDepartment)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            >
              {UNIVERSITY_DEPTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Caption & Hashtags */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">
              Caption & Campus Tags
            </label>
            <textarea
              rows={3}
              placeholder="What's happening around MIT ADT? #Hackathon #Rajbaug #DesignExhibition..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />

            {/* Quick Hashtag Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              {[
                '#MITADTPune',
                '#RajbaugCampus',
                '#VishwashantiDome',
                '#HackMIT',
                '#DesignShowcase',
                '#Robocon2026'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setCaption((prev) => `${prev} ${tag}`.trim())}
                  className="text-[10px] font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="font-medium">Stamp MIT ADT University Watermark</span>
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="w-4 h-4 accent-[#8B0000] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
