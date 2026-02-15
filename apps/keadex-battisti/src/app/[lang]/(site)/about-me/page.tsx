import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Timeline,
  TimelineItem,
} from '@keadex/keadex-ui-kit/components/cross/Timeline/Timeline'
import { type Metadata, type NextPage } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import atos from '../../../../../public/img/atos-logo.jpg'
import ibm from '../../../../../public/img/ibm-logo.jpg'
import me from '../../../../../public/img/me.png'
import paramount from '../../../../../public/img/paramount-logo.jpg'
import reply from '../../../../../public/img/reply-logo.jpg'
import univliverpool from '../../../../../public/img/univliverpool-logo.jpg'
import vodafone from '../../../../../public/img/vodafone-logo.jpg'
import painting from '../../../../../public/img/painting.svg'
import snowboarding from '../../../../../public/img/snowboarding.svg'
import martialArts from '../../../../../public/img/martial-arts.svg'
import motorbikes from '../../../../../public/img/motorbikes.svg'
import music from '../../../../../public/img/music.svg'
import spearfishing from '../../../../../public/img/spearfishing.svg'
import { getTranslation } from '../../../i18n'
import { PageProps } from '../layout'

const AboutMeItem = dynamic(
  () => import('../../../../components/AboutMeItem/AboutMeItem'),
)

const seo = {
  title: 'Keadex - About Me',
  description:
    'Born in the 90s, I grew up in southern Italy surrounded by martial arts, anime, video games, and computers. I fell in love with computer science when software was still distributed on floppy disks. I started my career as a Mobile Developer when Android was just emerging. Later, I took on roles such as Web Developer, Backend Developer, Tech Lead, and IT Manager. Today, I am an IT Architect with more than 10 years of experience in consulting companies and corporates.',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: ['keadex', 'giacomo simmi', 'it architect', 'software architect'],
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: me.src,
      },
    ],
  },
}

const AboutMe: NextPage<PageProps> = async ({ params }) => {
  const { lang } = await params
  const { t } = await getTranslation(lang)

  const timelineItems: TimelineItem[] = [
    {
      id: 'common-summary',
      description: (
        <div className="text-3xl text-brand2 mt-8">{t('common.summary')}</div>
      ),
    },
    {
      id: 'about-me_summary',
      description: (
        <div dangerouslySetInnerHTML={{ __html: t('home.about_me_summary') }} />
      ),
    },
    {
      id: 'hobbies',
      description: (
        <div className="text-3xl text-brand2 mt-8">{t('common.hobbies')}</div>
      ),
    },
    {
      id: 'about-me_hobbies',
      description: (
        <div className="about-me__hobbies">
          <Image src={snowboarding} alt="Snowboarding hobby" className="mt-0" />
          <Image src={martialArts} alt="Martial Arts hobby" className="" />
          <Image src={motorbikes} alt="Motorbikes hobby" className="" />
          <Image src={music} alt="Music hobby" className="" />
          <Image src={painting} alt="Painting hobby" className="" />
          <Image src={spearfishing} alt="Spearfishing hobby" className="" />
        </div>
      ),
    },
    {
      id: 'experience',
      description: (
        <div className="text-3xl text-brand2 mt-8">
          {t('common.experience')}
        </div>
      ),
    },
    {
      id: 'since',
      year: `${t('common.since')} '21`,
      title: 'Paramount',
      image: paramount,
      alt: 'Paramount logo',
      description: (
        <AboutMeItem
          role="IT Architect"
          lang={lang}
          areas={[t('common.massmedia'), t('common.streaming')]}
          skills={[
            {
              name: 'Micro Frontends, Microservices',
              percentage: '70%',
            },
            {
              name: 'CSR, SSR, SSG',
              percentage: '90%',
            },
            {
              name: 'TS/JS',
              percentage: '95%',
            },
            {
              name: 'React, Next.js, etc.',
              percentage: '95%',
            },
            {
              name: 'Nx',
              percentage: '95%',
            },
            {
              name: 'Webpack, Babel, swc, etc.',
              percentage: '50%',
            },
            {
              name: 'Node.js, NestJS, GraphQL',
              percentage: '95%',
            },
            {
              name: 'Redis',
              percentage: '90%',
            },
            {
              name: 'Jenkins, GitHub Actions, etc.',
              percentage: '60%',
            },
            {
              name: 'AWS, Anthos',
              percentage: '60%',
            },
            {
              name: 'C4 Model',
              percentage: '95%',
            },
            {
              name: 'Other...',
              percentage: '95%',
            },
          ]}
          activities={[]}
        />
      ),
    },
    {
      id: 'exp_18-21',
      year: `'18 - '21`,
      title: 'Vodafone',
      image: vodafone,
      alt: 'Vodafone logo',
      description: (
        <AboutMeItem
          role="IT Architect / IT Manager"
          lang={lang}
          areas={[t('common.ecommerce'), t('common.telecommunications')]}
          skills={[
            {
              name: 'Micro Frontends, Microservices',
              percentage: '70%',
            },
            {
              name: 'JS/TS',
              percentage: '95%',
            },
            {
              name: 'React',
              percentage: '95%',
            },
            {
              name: 'Adobe Experience Manager',
              percentage: '95%',
            },
            {
              name: 'Lerna',
              percentage: '80%',
            },
            {
              name: 'Node.js, Tomcat, etc.',
              percentage: '95%',
            },
            {
              name: 'Java',
              percentage: '70%',
            },
            {
              name: 'Spring, Camunda, etc.',
              percentage: '60%',
            },
            {
              name: 'Oracle, MongoDB, Kafka, etc.',
              percentage: '60%',
            },
            {
              name: 'AWS, Azure',
              percentage: '60%',
            },
            {
              name: 'C4 Model',
              percentage: '95%',
            },
            {
              name: 'Other...',
              percentage: '95%',
            },
          ]}
          activitiesi18nKeys={[
            'about_me.activities.people_management',
            'about_me.activities.requirements_analysis',
            'about_me.activities.system_design',
            'about_me.activities.arch_decision_making',
            'about_me.activities.risk_management',
            'about_me.activities.code_review_guidance',
            'about_me.activities.poc',
            'about_me.activities.performance_optimization',
            'about_me.activities.cost_estimation',
            'about_me.activities.documentation',
            'about_me.activities.vendor_management',
            'about_me.activities.collab_with_devs',
            'about_me.activities.integration_planning',
            'about_me.activities.security_considerations',
            'about_me.activities.evolutionary_planning',
            'about_me.activities.continuous_learning',
            'about_me.activities.leadership_and_mentoring',
            'about_me.activities.collab_and_communication',
          ]}
        />
      ),
    },
    {
      id: 'exp_17-18',
      year: `'17 - '18`,
      title: 'Atos',
      image: atos,
      alt: 'Atos logo',
      description: (
        <AboutMeItem
          role="Senior Software Engineer / IT Project Manager"
          lang={lang}
          areas={[t('common.energy_utilities'), t('common.retail')]}
          skills={[
            {
              name: 'Java',
              percentage: '90%',
            },
            {
              name: 'JS/TS',
              percentage: '80%',
            },
            {
              name: 'Struts 2',
              percentage: '90%',
            },
            {
              name: 'Angular',
              percentage: '60%',
            },
            {
              name: 'Ionic',
              percentage: '30%',
            },
            {
              name: 'Node.js, Tomcat, etc.',
              percentage: '95%',
            },
            {
              name: 'Other...',
              percentage: '60%',
            },
          ]}
          activitiesi18nKeys={[
            'about_me.activities.tech_leadership',
            'about_me.activities.code_review_quality',
            'about_me.activities.problem_solving',
            'about_me.activities.project_leadership',
            'about_me.activities.continuous_learning',
            'about_me.activities.code_refactoring',
            'about_me.activities.poc',
          ]}
        />
      ),
    },
    {
      id: 'exp_15-17',
      year: `'15 - '17`,
      title: 'IBM',
      image: ibm,
      alt: 'IBM logo',
      description: (
        <AboutMeItem
          role="Full Stack Developer"
          lang={lang}
          areas={[
            t('common.energy_utilities'),
            t('common.banking'),
            t('common.retail'),
          ]}
          skills={[
            {
              name: 'Java',
              percentage: '90%',
            },
            {
              name: 'JS/TS',
              percentage: '90%',
            },
            {
              name: 'Angular',
              percentage: '90%',
            },
            {
              name: 'Android',
              percentage: '30%',
            },
            {
              name: 'Spring',
              percentage: '80%',
            },
            {
              name: 'Node.js, Tomcat, etc.',
              percentage: '95%',
            },
            {
              name: 'IBM Algorithmics RTCE',
              percentage: '35%',
            },
            {
              name: 'Other...',
              percentage: '60%',
            },
          ]}
          activitiesi18nKeys={[]}
        />
      ),
    },
    {
      id: 'exp_14-15',
      year: `'14 - '15`,
      title: 'Open Reply',
      image: reply,
      alt: 'Open Reply logo',
      description: (
        <AboutMeItem
          role="Android & Mobile Hybrid Developer"
          lang={lang}
          areas={[
            t('common.energy_utilities'),
            t('common.banking'),
            t('common.retail'),
          ]}
          skills={[
            {
              name: 'Java',
              percentage: '100%',
            },
            {
              name: 'Android',
              percentage: '100%',
            },
            {
              name: 'ProGuard',
              percentage: '90%',
            },
            {
              name: 'Fabric (now Firebase)',
              percentage: '90%',
            },
            {
              name: 'Adobe Photoshop',
              percentage: '30%',
            },
            {
              name: 'Other...',
              percentage: '60%',
            },
          ]}
          activitiesi18nKeys={[
            'about_me.activities.problem_solving',
            'about_me.activities.app_development',
            'about_me.activities.arch_decision_making',
            'about_me.activities.security_considerations',
            'about_me.activities.continuous_learning',
            'about_me.activities.poc',
            'about_me.activities.documentation',
          ]}
        />
      ),
    },
    {
      id: 'exp_13',
      year: `2013`,
      title: 'University of Liverpool',
      image: univliverpool,
      alt: 'University of Liverpool logo',
      description: (
        <AboutMeItem
          role="Android Developer"
          lang={lang}
          areas={[t('common.healthcare')]}
          skills={[
            {
              name: 'Java',
              percentage: '100%',
            },
            {
              name: 'Android',
              percentage: '100%',
            },
            {
              name: 'Adobe Photoshop',
              percentage: '30%',
            },
            {
              name: 'Other...',
              percentage: '60%',
            },
          ]}
          activitiesi18nKeys={[
            'about_me.activities.app_development',
            'about_me.activities.poc',
            'about_me.activities.documentation',
          ]}
        />
      ),
    },
    {
      id: 'exp_empty',
    },
  ]

  return (
    <div className="about-me-page page font-light flex flex-col pb-0">
      <div className="flex mt-10 flex-col md:flex-row">
        <Image
          src={me}
          alt="Me and Rocky"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-lg mx-auto md:mx-0 mb-5 md:mb-0"
        />
        <div className="block mx-auto md:mx-5 my:0 md:my-auto text-center md:text-left">
          <h2 className="font-normal">Giacomo Simmi</h2>
          <h3>IT Architect</h3>
          <div className="mt-3">
            <Link href="https://github.com/keadex/keadex" target="_blank">
              <FontAwesomeIcon icon={faGithub} className="text-xl" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/giacomosimmi"
              target="_blank"
              className="mr-auto lg:!mr-8"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-xl ml-5" />
            </Link>
          </div>
        </div>
      </div>
      <Timeline items={timelineItems} ImageComponent={Image} />
    </div>
  )
}

export default AboutMe
