// @ts-nocheck
/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownToggle } from 'components/bootstrap-osu-collector'

function DropdownButton({ title, titleAction, menuItems, menuActions, style }) {
  const [dropdownVisible, setDropdownVisible] = useState(false)

  return (
    <>
      <div
        className="d-flex flex-column"
        style={{
          ...style,
          position: 'relative',
        }}
      >
        <Dropdown as={ButtonGroup}>
          <Button onClick={titleAction}>{title}</Button>
          <DropdownToggle
            split
            style={{ width: 0 }}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          />
        </Dropdown>
        {dropdownVisible &&
          menuItems.map((title, i) => (
            <Button
              key={i}
              variant="light"
              className="shadow-sm text-sm"
              style={{
                position: 'absolute',
                transform: 'translate(0, 38px)',
                margin: '0 auto',
                textAlign: 'center',
                width: '100%',
                padding: '5px 10px',
                whiteSpace: 'nowrap',
              }}
              onClick={menuActions[i]}
            >
              <small> {title} </small>
            </Button>
          ))}
      </div>
      {/* <div className='mx-1'>
        <div role='group' className='btn-group'>
          <button type='button' className='btn btn-primary'>
            Add to osu!
          </button>
          <button aria-haspopup='true' aria-expanded='true' type='button' className='dropdown-toggle dropdown-toggle-split btn btn-primary'>
            <span className='sr-only'>
              Toggle dropdown
            </span>
          </button>
        </div>
        <button type='button' className='btn btn-secondary'>
          Export as collection.db
        </button>
      </div> */}
    </>
  )
  // if (dropdownVisible) {
  //   return (
  //     <div role='group' className='mx-1 dropdown btn-group'>
  //       <button type='button' className='btn btn-primary'>
  //         Add to osu!
  //       </button>
  //       <button
  //         aria-haspopup='true'
  //         aria-expanded='false'
  //         type='button'
  //         className='dropdown-toggle dropdown-toggle-split btn btn-primary'
  //         onClick={() => {
  //           setDropdownVisible(!dropdownVisible)
  //         }}
  //       >
  //         <span className='sr-only'>
  //           Toggle dropdown
  //         </span>
  //       </button>
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div role='group' className='mx-1 show dropdown btn-group'>
  //       <button type='button' className='btn btn-primary'>
  //         Add to osu!
  //       </button>
  //       <button
  //         aria-haspopup='true'
  //         aria-expanded='true'
  //         type='button'
  //         className='dropdown-toggle dropdown-toggle-split btn btn-primary'
  //         click={() => {
  //           setDropdownVisible(!dropdownVisible)
  //         }}
  //       >
  //         <span className='sr-only'>
  //           Toggle dropdown</span>
  //       </button>
  //       <div
  //         x-placement='bottom-start'
  //         aria-labelledby=''
  //         className='dropdown-menu'
  //         style={{
  //           position: 'absolute',
  //           top: '0px',
  //           left: '0px',
  //           margin: '0px',
  //           opacity: 0,
  //           pointerEvents: 'none'
  //         }}
  //       >
  //         <a href='#' className='dropdown-item' role='button'>
  //           {children}
  //         </a>
  //       </div>
  //     </div>
  //   )
  // }
}

export default DropdownButton
