import type React from "react";
import { useCallback, useState } from "react";

export interface CopyTextButtonProps extends React.HTMLAttributes<HTMLButtonElement>, React.PropsWithChildren {
  textToCopy: string
  feedbackDuration?: number
}

export function CopyTextButton({
  textToCopy,
  onClick: baseOnClick,
  feedbackDuration = 2000,
  children,
  className = '',
  ...rest
}: CopyTextButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        await navigator.clipboard.writeText(textToCopy)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), feedbackDuration)
      }catch (err) {
        console.error('Failed to copy text: ', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), feedbackDuration)
        } catch (err) {
          console.error('Fallback copy failed: ', err)
        }
        document.body.removeChild(textArea)
      }  
      
      if(baseOnClick) baseOnClick(e);
    },
    [textToCopy, baseOnClick, feedbackDuration]
  )
  return (
    <button
      {...rest}
      className={[className, isCopied ? 'copied' : ''].filter(Boolean).join(' ')}
      onClick={handleCopy}
      disabled={isCopied}
      aria-label={isCopied ? 'Copied!' : `Copy "${textToCopy}"`}
    >
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 12l5 5l10 -10" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
        </svg>
      )}
      {children}
    </button>
  )
}