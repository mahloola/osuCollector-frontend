import { Card } from 'react-bootstrap'
import ReactDom from 'react-dom'

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    zIndex: 1000
}

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    zIndex: 1000
}

export default function Modal({ open, children, onClose}) {
    if (!open) return null

    return ReactDom.createPortal(
        <>
            <div style={OVERLAY_STYLES} onClick={onClose}/>
            <Card className='p-5 shadow bg-white rounded' style={MODAL_STYLES}>
                {children}
            </Card>
        </>,
        document.getElementById('portal')
    )
}