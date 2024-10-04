import ProjectSettings from '../../views/ProjectSettings/ProjectSettings'

export interface ModalCreateProjectProps {
  mode: 'edit' | 'create'
  hideModal: () => void
  onProjectCreated?: (projectRoot: string) => void
}

export const ModalCreateProject = (props: ModalCreateProjectProps) => {
  return (
    <ProjectSettings
      mode={'create'}
      hideModal={props.hideModal}
      onProjectCreated={props.onProjectCreated}
    />
  )
}

export default ModalCreateProject
