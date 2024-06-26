import * as React from 'react'
import CalendarCom from '../Calendar'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<CalendarCom />)
  expect(tree).toMatchSnapshot()
})