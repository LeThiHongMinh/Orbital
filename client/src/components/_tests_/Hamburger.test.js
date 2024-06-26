import * as React from 'react'
import Hamburger from '../Hamburger'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Hamburger />)
  expect(tree).toMatchSnapshot()
})