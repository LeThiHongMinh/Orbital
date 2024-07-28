import * as React from 'react'
import StatusComponent from '../Status'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<StatusComponent />)
  expect(tree).toMatchSnapshot()
})