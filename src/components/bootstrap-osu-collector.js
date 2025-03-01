import * as ReactBootstrap from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'
import styled, { css, ThemeContext } from 'styled-components'
import ReactBootstrapFloatingLabel from 'react-bootstrap-floating-label'
import { useContext } from 'react'

const backgroundColor = (props) =>
  props.$lightbg2 ? props.theme.primary25 : props.$lightbg ? props.theme.primary15 : props.theme.primary8

const backgroundAndBorderColor = (props) =>
  props.theme.darkMode &&
  css`
    background-color: ${backgroundColor};
    border-color: rgba(0, 0, 0, 0.125);
    color: #f8f8f2;
  `

const Card = styled(ReactBootstrap.Card)`
  ${backgroundAndBorderColor}
`

const CardFooter = styled(ReactBootstrap.Card.Footer)`
  ${backgroundAndBorderColor}
`

const CardBody = styled(ReactBootstrap.Card.Body)`
  ${backgroundAndBorderColor}
`

const ListGroupItem = styled(ReactBootstrap.ListGroupItem)`
  ${backgroundAndBorderColor}
`

const Button = styled(ReactBootstrap.Button)`
  ${(props) =>
    props.theme.darkMode &&
    css`
      ${(props) =>
        (props.variant === 'primary' || !props.variant) &&
        css`
          background-color: ${(props) => props.theme.primary50};
          border-color: ${(props) => props.theme.primary};
          color: #f8f8f2;
        `}
    `}
`

const DropdownToggle = styled(Dropdown.Toggle)`
  ${(props) =>
    props.theme.darkMode &&
    css`
      ${(props) =>
        (props.variant === 'primary' || !props.variant) &&
        css`
          background-color: ${(props) => props.theme.primary50};
          border-color: ${(props) => props.theme.primary};
          color: #f8f8f2;
        `}
    `}
`

const FormControl = styled(ReactBootstrap.Form.Control)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary20};
      border-color: ${({ theme }) => theme.primary40};
      &::placeholder {
        color: #ffffff44;
      }
      color: #f8f8f2 !important;
      &:focus {
        background-color: ${({ theme }) => theme.primary20};
        border: 0;
        color: #f8f8f2 !important;
      }
    `}
`

const ModalHeader = styled(ReactBootstrap.Modal.Header)`
  ${backgroundAndBorderColor}
`

const ModalBody = styled(ReactBootstrap.Modal.Body)`
  ${backgroundAndBorderColor}
`

const FloatingLabel = styled(ReactBootstrapFloatingLabel)`
  ${({ theme }) =>
    theme.darkMode &&
    css`
      background-color: ${({ theme }) => theme.primary20};
      border-color: ${({ theme }) => theme.primary40};
      color: #f8f8f2;
      &:focus {
        background-color: ${({ theme }) => theme.primary20};
        border: 0;
        color: #f8f8f2;
      }
    `}
`

function ReactPlaceholder({ ready, showLoadingAnimation, type, className, style, children }) {
  const theme = useContext(ThemeContext)
  const backgroundColor = theme.darkMode ? theme.primary30 : '#f8f8f2'
  if (ready) {
    return children
  } else if (type === 'rect') {
    return <div className={className} style={{ ...style, backgroundColor }}></div>
  } else {
    return (
      <div className={className} style={style}>
        {showLoadingAnimation && (
          <div className='d-flex justify-content-center align-items-center'>
            <div className='spinner-border' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export * from 'react-bootstrap'
export {
  Button,
  Card,
  CardBody,
  CardFooter,
  DropdownToggle,
  FloatingLabel,
  FormControl,
  ListGroupItem,
  ModalHeader,
  ModalBody,
  ReactPlaceholder,
}
