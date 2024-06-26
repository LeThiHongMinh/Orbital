import * as React from 'react'
import CourseList from '../Courselist'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<CourseList />)
  expect(tree).toMatchSnapshot()
})