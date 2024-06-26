import * as React from 'react'
import ToDoList from '../Todo'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<ToDoList />)
  expect(tree).toMatchSnapshot()
})