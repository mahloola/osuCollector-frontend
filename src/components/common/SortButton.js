import styled from 'styled-components'
import './SortButton.css'

const StyledButton = styled.button`
  outline: none;
  border: none;
  border-radius: 8px;
  color: ${(props) => (props.theme.darkMode ? '#eee' : '#000')};
  background-color: ${(props) =>
    props.theme.darkMode
      ? props.active
        ? props.theme.primary50
        : props.theme.primary25
      : props.active
      ? '#e6e6e6'
      : '#f1f1f1'};

  &:hover,
  &:active {
    background-color: ${(props) =>
      props.theme.darkMode
        ? props.active
          ? props.theme.primary60
          : props.theme.primary35
        : props.active
        ? '#eee'
        : '#ddd'};
  }
`

// sortDirection: null or 'asc' or 'desc'
function SortButton({ children, className, sortDirection, onClick }) {
  if (sortDirection === null) {
    return (
      <StyledButton className={'px-3 py-1 ' + className} onClick={onClick}>
        <div className="mr-3">{children}</div>
      </StyledButton>
    )
  }
  return (
    <StyledButton active={true} className={'px-3 py-1 ' + className} onClick={onClick}>
      {children}
      {sortDirection === 'asc' ? (
        <i className="ml-2 fas fa-sort-up" />
      ) : (
        <i className="ml-2 fas fa-sort-down" />
      )}
    </StyledButton>
  )
}

export default SortButton
