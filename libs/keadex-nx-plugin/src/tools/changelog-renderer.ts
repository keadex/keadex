import DefaultChangelogRenderer from 'nx/release/changelog-renderer'

export default class VersionPlanChangelogRenderer extends DefaultChangelogRenderer {
  constructor(config) {
    super(config)
  }

  render(): Promise<string> {
    let changes = ''
    const changelogs = this.changes[0].description.split(/^# (.*)/gm)
    const changelogIndex = changelogs.findIndex((val) => val === this.project)
    if (changelogIndex !== -1 && changelogIndex + 1 < changelogs.length) {
      changes = changelogs[changelogIndex + 1]
    }

    const changelog = `${changes}`
    return Promise.resolve(changelog)
  }
}
