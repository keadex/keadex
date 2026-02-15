'use client'

import { Progress } from '@keadex/keadex-ui-kit/components/cross/Progress/Progress'
import { Tags } from '@keadex/keadex-ui-kit/components/cross/Tags/Tags'
import { Trans } from 'react-i18next'
import { useTranslation } from '../../app/i18n/client'
import type { JSX } from 'react'

export type AboutMeSkill = {
  percentage: string
  name: string
}

export type AboutMeItemProps = {
  lang: string
  role: string
  skills: AboutMeSkill[]
  areas: string[] | JSX.Element[]
  activities?: string[] | JSX.Element[]
  activitiesi18nKeys?: string[]
}

export const AboutMeItem = ({
  lang,
  role,
  skills,
  areas,
  activities,
  activitiesi18nKeys,
}: AboutMeItemProps) => {
  const { t } = useTranslation(lang)

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row">
        <h3 className="text-brand1">{role}</h3>
        <div className="grow my-2 md:mt-0">
          <Tags
            tags={areas}
            className="float-none top-0 translate-y-0 md:float-right md:top-1/2 md:-translate-y-1/2"
          />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 grid-flow-row gap-2">
        {skills.map((skill, index) => (
          <Progress
            key={`${skill.name}_${index}`}
            width={skill.percentage}
            label={skill.name}
            className="rounded-md"
          />
        ))}
      </div>
      <ul className="list-disc ml-4 mt-3">
        {activities &&
          activities.map((activity, index) => (
            <li key={index} className="py-1">
              {activity}
            </li>
          ))}
        {activitiesi18nKeys &&
          activitiesi18nKeys.map((i18nKey) => (
            <li key={i18nKey} className="py-1">
              <Trans i18nKey={i18nKey} t={t} components={{ span: <span /> }} />
            </li>
          ))}
      </ul>
    </div>
  )
}

export default AboutMeItem
