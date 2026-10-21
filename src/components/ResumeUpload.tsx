import { useId, useState, type DragEvent, type HTMLAttributes } from 'react'

import { icons } from '../assets'
import './ResumeUpload.css'

type ResumeUploadProps = Omit<HTMLAttributes<HTMLLabelElement>, 'onDrop' | 'onDragOver'> & {
  variant: 'hero' | 'card'
  onFile?: (file: File) => void
}

export function ResumeUpload({ variant, onFile, ...rest }: ResumeUploadProps) {
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
      <span className="resume-upload__icon">
        <span className="resume-upload__glyph">
          <img src={icons.upload} alt="" />
        </span>
      </span>
      <span className="resume-upload__text">
        <span className="resume-upload__title">{fileName ?? 'Click or Drop your resume here'}</span>
        <span className="resume-upload__hint">PDF or DOCX · free scan · no signup required</span>
      </span>
    </label>
  )
}
