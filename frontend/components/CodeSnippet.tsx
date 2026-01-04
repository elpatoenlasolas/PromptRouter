'use client'

import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'

interface CodeSnippetProps {
  code: string
  language?: string
  title?: string
}

export default function CodeSnippet({ code, language = 'python', title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {title && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <Code className="w-4 h-4" />
            {title}
          </div>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-gray-100 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  )
}
