import React, { useRef, useState, useEffect } from 'react';
import { Upload, RotateCcw, Camera, Check, Image as ImageIcon } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  clickable?: boolean;
  showActionButton?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  clickable = true,
  showActionButton = false
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('saengdi_custom_logo');
    if (saved) {
      setCustomLogo(saved);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('이미지 파일 용량은 8MB 이하만 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomLogo(result);
        localStorage.setItem('saengdi_custom_logo', result);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomLogo(null);
    localStorage.removeItem('saengdi_custom_logo');
    setShowModal(false);
  };

  const heightClasses = {
    sm: 'h-8 sm:h-9 max-h-10 w-auto shrink-0',
    md: 'h-10 sm:h-12 max-h-14 w-auto shrink-0',
    lg: 'h-12 sm:h-16 max-h-20 w-auto shrink-0'
  };

  return (
    <>
      <div className={`inline-flex flex-wrap items-center gap-3 select-none ${className}`}>
        <div
          className={`relative inline-flex items-center ${
            clickable ? 'cursor-pointer group' : ''
          }`}
          onClick={() => clickable && setShowModal(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title={clickable ? '클릭하여 보유하신 생디 원본 로고 이미지로 교체/등록' : undefined}
        >
          {customLogo ? (
            <div className="relative">
              <img
                src={customLogo}
                alt="생디 원본 로고"
                className={`object-contain object-left transition-transform duration-200 group-hover:scale-102 ${heightClasses[size]}`}
              />
              {clickable && isHovered && (
                <div className="no-print absolute inset-0 bg-slate-900/50 rounded-lg flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-5 h-5 drop-shadow" />
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src="/saengdi_logo.svg"
                alt="생디 학생부를 디자인하다"
                className={`object-contain object-left transition-transform duration-200 group-hover:scale-102 ${heightClasses[size]}`}
              />
              {clickable && isHovered && (
                <div className="no-print absolute inset-0 bg-slate-900/40 rounded-lg flex items-center justify-center text-white text-xs">
                  <Camera className="w-4 h-4 mr-1" />
                  <span className="font-bold">로고 변경</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 액션 버튼 또는 교체 안내 태그 */}
        {clickable && showActionButton && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="no-print inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 transition shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>원본 로고 파일 교체/등록</span>
          </button>
        )}
      </div>

      {/* 로고 교체 모달 */}
      {showModal && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                ‘생디’ 원본 로고 이미지 적용
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              첨부하신 <strong>생디 원본 로고 파일(PNG, JPG, SVG, WebP)</strong>을 업로드하시면 왜곡 없이 원본 비율 그대로 상단 헤더 및 리포트/인쇄물에 즉시 표시됩니다.
            </p>

            <div
              className="p-6 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex flex-col items-center justify-center text-center mb-5 cursor-pointer transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                로고 이미지 파일 선택 또는 드래그
              </p>
              <p className="text-xs text-slate-400 mb-3">
                PNG, JPG, SVG, WebP 권장 (최대 8MB)
              </p>
              <span className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition">
                내 컴퓨터에서 파일 찾기
              </span>
            </div>

            {customLogo && (
              <div className="mb-5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    현재 사용자 지정 로고 적용 중
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-rose-600 font-semibold px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs hover:bg-rose-50 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  기본 벡터 로고로 초기화
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
