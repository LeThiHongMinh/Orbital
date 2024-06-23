import * as React from 'react'
import ProfilePage from '../Profile'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<ProfilePage />)
  expect(tree).toMatchSnapshot()
})