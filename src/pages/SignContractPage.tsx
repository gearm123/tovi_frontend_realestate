import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useParams } from 'react-router-dom'
import { leaseParagraphs } from '../lib/leaseDocument'
import { fetchContractForSigning, submitContractSignature } from '../services/listingsApi'
import type { ContractRecord } from '../types/contract'
import './SignContractPage.css'

export default function SignContractPage() {
  const { token = '' } = useParams()
  const [contract, setContract] = useState<ContractRecord | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [signerName, setSignerName] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const next = await fetchContractForSigning(token)
        if (cancelled) return
        setContract(next)
        setSignerName(next.details.tenant1Name)
        if (next.status === 'signed') setDone(true)
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'This signing link is not valid.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const submit = async () => {
    if (!signature || !signerName.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const saved = await submitContractSignature(token, signerName.trim(), signature)
      setContract(saved)
      setDone(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The signature could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="sign-contract" dir="rtl">
      <article className="sign-contract__paper">
        {loading ? <p>טוען את ההסכם…</p> : null}
        {!loading && error && !contract ? <p className="sign-contract__error">{error}</p> : null}
        {contract ? (
          <>
            {leaseParagraphs(contract.details).flatMap((paragraph) => paragraph.split('\n')).map((line, index) =>
              line ? (
                <p
                  key={`${index}-${line.slice(0, 12)}`}
                  className={line.length < 42 && !line.includes('.') ? 'sign-contract__heading' : undefined}
                >
                  {line}
                </p>
              ) : (
                <div key={`gap-${index}`} className="sign-contract__gap" />
              ),
            )}
            {done ? (
              <p className="sign-contract__done">ההסכם נחתם ונשמר. אפשר לסגור את הדף.</p>
            ) : (
              <section className="sign-contract__sign">
                <label>
                  שם החותם
                  <input value={signerName} onChange={(event) => setSignerName(event.target.value)} />
                </label>
                <p>חתמו בתוך המסגרת</p>
                <SignaturePad onChange={setSignature} />
                {error ? <p className="sign-contract__error">{error}</p> : null}
                <button type="button" disabled={!signature || !signerName.trim() || submitting} onClick={submit}>
                  {submitting ? 'שומר…' : 'חתימה ושליחה'}
                </button>
              </section>
            )}
          </>
        ) : null}
      </article>
    </main>
  )
}

function SignaturePad({ onChange }: { onChange: (value: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = Math.floor(width * scale)
    canvas.height = Math.floor(height * scale)
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(scale, scale)
    context.lineWidth = 2
    context.lineCap = 'round'
    context.strokeStyle = '#1d2327'
  }, [])

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    drawing.current = true
    canvas.setPointerCapture(event.pointerId)
    const { x, y } = point(event)
    context.beginPath()
    context.moveTo(x, y)
  }

  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const { x, y } = point(event)
    context.lineTo(x, y)
    context.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    onChange(canvas ? canvas.toDataURL('image/png') : null)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    onChange(null)
  }

  return (
    <div className="sign-contract__pad">
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />
      <button type="button" className="sign-contract__clear" onClick={clear}>
        נקה
      </button>
    </div>
  )
}
