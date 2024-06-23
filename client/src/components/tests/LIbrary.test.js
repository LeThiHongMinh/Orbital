import * as React from 'react'
import Library from '../Library'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<Library />)
  expect(tree).toMatchSnapshot()
})