import * as ReactBootstrap from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'
import styled, { css, ThemeContext } from 'styled-components'
import ReactBootstrapFloatingLabel from 'react-bootstrap-floating-label'
import _ReactPlaceholder from 'react-placeholder/lib'
import { useContext } from 'react'

const backgroundColor = (props) =>
  props.$lightbg2 ? props.theme.primary25 : props.$lightbg ? props.theme.primary15 : props.theme.primary8

const backgroundAndBorderColor = (props) =>
  props.theme.darkMode &&
  css`
    background-color: ${backgroundColor};
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
      color: #f8f8f2;
      &:focus {
        background-color: ${({ theme }) => theme.primary20};
        border: 0;
        color: #f8f8f2;
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

function ReactPlaceholder(props) {
  const theme = useContext(ThemeContext)
  if (theme.darkMode) {
    return (
      <_ReactPlaceholder {...props} color={props.color || theme.primary30}>
        {props.children}
      </_ReactPlaceholder>
    )
  } else {
    return <_ReactPlaceholder {...props}>{props.children}</_ReactPlaceholder>
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
