import { useId, useState, type DragEvent, type HTMLAttributes } from 'react'

import { icons } from '../assets'
import { revealDelay as delayStyle } from '../intro'
import { LinesText } from './LinesText'
import './ResumeUpload.css'

type ResumeUploadProps = Omit<HTMLAttributes<HTMLLabelElement>, 'onDrop' | 'onDragOver'> & {
  variant: 'hero' | 'card'
  onFile?: (file: File) => void
  /** Entrance delay (ms): the box fades in, then its two lines rise. */
  revealDelay?: number
}

export function ResumeUpload({ variant, onFile, revealDelay = 0, ...rest }: ResumeUploadProps) {
  const inputId = useId()
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setFileName(file.name)
    onFile?.(file)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files[0])
  }

  return (
    <label
      data-reveal="fade"
      style={delayStyle(revealDelay)}
      {...rest}
      className={`resume-upload resume-upload--${variant}`}
      htmlFor={inputId}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        id={inputId}
        className="visually-hidden"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <span className="resume-upload__icon" data-reveal="scale" style={delayStyle(revealDelay + 250)}>
        <span className="resume-upload__glyph">
          <img src={icons.upload} alt="" />
        </span>
      </span>
      <span className="resume-upload__text">
        <LinesText
          as="span"
          className="resume-upload__title"
          text={fileName ?? 'Click or Drop your resume here'}
          delay={revealDelay + 350}
        />
        <LinesText
          as="span"
          className="resume-upload__hint"
          text="PDF or DOCX · free scan · no signup required"
          delay={revealDelay + 500}
        />
      </span>
    </label>
  )
}
