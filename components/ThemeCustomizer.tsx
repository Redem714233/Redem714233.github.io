'use client';

import { useState, useEffect } from 'react';

export default function ThemeCustomizer() {
  const [hue, setHue] = useState(250);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取保存的色调
    const savedHue = localStorage.getItem('hue');
    if (savedHue) {
      const hueValue = parseInt(savedHue);
      setHue(hueValue);
      document.documentElement.style.setProperty('--hue', savedHue);
    }
  }, []);

  const handleChange = (value: number) => {
    setHue(value);
    document.documentElement.style.setProperty('--hue', value.toString());
    localStorage.setItem('hue', value.toString());
  };

  const presets = [
    { name: '蓝色', hue: 250, color: 'hsl(250, 70%, 50%)' },
    { name: '紫色', hue: 280, color: 'hsl(280, 70%, 50%)' },
    { name: '粉色', hue: 330, color: 'hsl(330, 70%, 50%)' },
    { name: '橙色', hue: 30, color: 'hsl(30, 70%, 50%)' },
    { name: '绿色', hue: 150, color: 'hsl(150, 70%, 50%)' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
        aria-label="主题色调设置"
      >
        🎨
      </button>

      {/* 弹出面板 */}
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 -z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 设置面板 */}
          <div className="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                主题色调
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 当前色调预览 */}
            <div className="mb-6">
              <div
                className="h-20 rounded-lg mb-3 flex items-center justify-center text-white font-semibold text-lg shadow-inner"
                style={{ background: `hsl(${hue}, 70%, 50%)` }}
              >
                HSL({hue}°, 70%, 50%)
              </div>
            </div>

            {/* 滑块 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                色相环 (0° - 360°)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => handleChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    hsl(0, 70%, 50%),
                    hsl(60, 70%, 50%),
                    hsl(120, 70%, 50%),
                    hsl(180, 70%, 50%),
                    hsl(240, 70%, 50%),
                    hsl(300, 70%, 50%),
                    hsl(360, 70%, 50%)
                  )`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>红</span>
                <span>黄</span>
                <span>绿</span>
                <span>青</span>
                <span>蓝</span>
                <span>紫</span>
                <span>红</span>
              </div>
            </div>

            {/* 预设颜色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                快速选择
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.hue}
                    onClick={() => handleChange(preset.hue)}
                    className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                      hue === preset.hue
                        ? 'border-gray-800 dark:border-gray-200 shadow-lg'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* 提示 */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              设置会自动保存到浏览器
            </p>
          </div>
        </>
      )}
    </div>
  );
}
