import * as React from 'react'
import ProgressBar from '../ProgressBar'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<ProgressBar />)
  expect(tree).toMatchSnapshot()
})