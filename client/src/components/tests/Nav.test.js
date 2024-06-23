import * as React from 'react'
import Nav from '../Nav'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<Nav />)
  expect(tree).toMatchSnapshot()
})