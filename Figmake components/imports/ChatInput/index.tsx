import svgPaths from "./svg-vgaswhc3os";

export default function ChatInput({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#f5f5f7] drop-shadow-[0px_4px_8px_rgba(0,0,0,0.03)] relative rounded-[36px] w-[980px]"} data-name="Chat Input">
      <div aria-hidden className="absolute border border-[#e4e4e9] border-solid inset-0 pointer-events-none rounded-[36px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[12px] relative size-full">
        <div className="relative shrink-0 w-full" data-name="attachments-row">
          <div className="content-stretch flex gap-[8px] items-start pb-[4px] pt-[8px] px-[12px] relative size-full">
            <div className="bg-white content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[16px] shrink-0" data-name="chip">
              <div aria-hidden className="absolute border border-[#e4e4e9] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <div className="content-stretch flex flex-col h-[26px] items-start relative shrink-0 w-[24px]" data-name="pdf-icon-container">
                <div className="bg-[#f2efe9] h-[26px] relative rounded-bl-[2px] rounded-br-[2px] rounded-tl-[2px] rounded-tr-[6px] shrink-0 w-[20px]" data-name="pdf-bg">
                  <div aria-hidden className="absolute border border-[#d4cfc7] border-solid inset-0 pointer-events-none rounded-bl-[2px] rounded-br-[2px] rounded-tl-[2px] rounded-tr-[6px]" />
                </div>
                <div className="absolute flex items-center justify-center left-[8px] size-[6px] top-[-6px]">
                  <div className="flex-none rotate-180">
                    <div className="relative size-[6px]" data-name="pdf-corner">
                      <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                        <svg className="block size-full" fill="none" height="4.5" preserveAspectRatio="none" viewBox="0 0 5.19615 4.5" width="5.19615">
                          <path d={svgPaths.p238fbe00} fill="#D4CFC7" id="pdf-corner" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bg-[#e24c4c] content-stretch flex h-[10px] items-center justify-center left-px px-[2px] py-px rounded-[1px] top-[11px] w-[18px]" data-name="pdf-banner">
                  <p className="[word-break:break-word] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[6px] text-center text-white whitespace-nowrap">PDF</p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#111113] text-[16px] whitespace-nowrap">brief.pdf</p>
              <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="close-button">
                <div className="relative shrink-0 size-[10px]" data-name="x-circle">
                  <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
                    <g clipPath="url(#clip0_0_8)" id="x-circle">
                      <path d={svgPaths.pda51f00} id="Vector" stroke="#636366" strokeLinecap="round" strokeWidth="2" />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_8">
                        <rect fill="white" height="10" width="10" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[16px] shrink-0" data-name="chip">
              <div aria-hidden className="absolute border border-[#e4e4e9] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <div className="bg-[#87c5f8] relative rounded-[8px] shrink-0 size-[24px]" data-name="image-preview-placeholder" />
              <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#111113] text-[16px] whitespace-nowrap">cloud.png</p>
              <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="close-button">
                <div className="relative shrink-0 size-[10px]" data-name="x-circle">
                  <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
                    <g clipPath="url(#clip0_0_8)" id="x-circle">
                      <path d={svgPaths.pda51f00} id="Vector" stroke="#636366" strokeLinecap="round" strokeWidth="2" />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_8">
                        <rect fill="white" height="10" width="10" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white relative rounded-[28px] shrink-0 w-full" data-name="inner-card-container">
          <div className="content-stretch flex flex-col gap-[36px] items-start pb-[20px] pt-[28px] px-[24px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[32px] not-italic relative shrink-0 text-[#111113] text-[24px] tracking-[-0.5px] w-full">Can you create folders in Google Docs</p>
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="toolbar-row">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="left-toolbar-group">
                <div className="bg-white content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[48px]" data-name="add-doc-button">
                  <div aria-hidden className="absolute border border-[#e4e4e9] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <div className="relative shrink-0 size-[22px]" data-name="file-plus">
                    <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
                      <g id="file-plus">
                        <path d={svgPaths.p199b5dc0} id="Vector" stroke="#1C1C1E" strokeLinecap="round" strokeWidth="2" />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="bg-[#f4f4f6] content-stretch flex gap-[4px] items-center p-[4px] relative rounded-[16px] shrink-0" data-name="segmented-tool-panel">
                  <div className="bg-white content-stretch drop-shadow-[0px_2px_2px_rgba(0,0,0,0.04)] flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="segment-wand">
                    <div className="relative shrink-0 size-[18px]" data-name="wand-sparkles">
                      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
                        <g clipPath="url(#clip0_0_12)" id="wand-sparkles">
                          <path d={svgPaths.p36692280} id="Vector" stroke="#1C1C1E" strokeLinecap="round" strokeWidth="2" />
                        </g>
                        <defs>
                          <clipPath id="clip0_0_12">
                            <rect fill="white" height="18" width="18" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="segment-dashed-circle">
                    <div className="relative shrink-0 size-[18px]" data-name="circle-dashed">
                      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
                        <g clipPath="url(#clip0_0_10)" id="circle-dashed">
                          <path d={svgPaths.p44fa100} id="Vector" stroke="#8E8E93" strokeLinecap="round" strokeWidth="2" />
                        </g>
                        <defs>
                          <clipPath id="clip0_0_10">
                            <rect fill="white" height="18" width="18" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="segment-cursor">
                    <div className="relative shrink-0 size-[18px]" data-name="square-dashed-mouse-pointer">
                      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
                        <g id="square-dashed-mouse-pointer">
                          <path d={svgPaths.p1c0f6080} id="Vector" stroke="#8E8E93" strokeLinecap="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white content-stretch flex gap-[10px] items-center px-[16px] py-[10px] relative rounded-[16px] shrink-0" data-name="model-selector-badge">
                  <div aria-hidden className="absolute border border-[#e4e4e9] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <div className="relative shrink-0 size-[20px]" data-name="atom">
                    <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                      <g id="atom">
                        <path d={svgPaths.p398bca00} id="Vector" stroke="#1C1C1E" strokeLinecap="round" strokeWidth="2" />
                      </g>
                    </svg>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111113] text-[18px] whitespace-nowrap">GPT 5.0</p>
                </div>
              </div>
              <div className="bg-[#111] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[48px]" data-name="voice-audio-button">
                <div className="content-stretch flex gap-[3px] h-[20px] items-center relative shrink-0" data-name="waveform-container">
                  <div className="bg-white h-[12px] relative rounded-[1.5px] shrink-0 w-[2.5px]" data-name="wave-bar-1" />
                  <div className="bg-white h-[18px] relative rounded-[1.5px] shrink-0 w-[2.5px]" data-name="wave-bar-2" />
                  <div className="bg-white h-[8px] relative rounded-[1.5px] shrink-0 w-[2.5px]" data-name="wave-bar-3" />
                  <div className="bg-white h-[16px] relative rounded-[1.5px] shrink-0 w-[2.5px]" data-name="wave-bar-4" />
                  <div className="bg-white h-[10px] relative rounded-[1.5px] shrink-0 w-[2.5px]" data-name="wave-bar-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}