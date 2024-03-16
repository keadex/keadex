export type TimelineItem = {
  year?: string
  title?: string
  image?: unknown
  alt?: string
  description?: string | JSX.Element
}

export type TimelineProps = {
  items: TimelineItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ImageComponent?: React.ComponentType<any>
}

export const Timeline = (props: TimelineProps) => {
  function renderImage(image: unknown, alt?: string) {
    if (props.ImageComponent) {
      return (
        <props.ImageComponent
          src={image}
          alt={alt ?? ''}
          className="rounded-full shadow-lg w-16 h-16 mx-auto"
        />
      )
    } else {
      return (
        <img
          src={image as string}
          alt={alt ?? ''}
          className="rounded-full shadow-lg w-16 h-16 mx-auto"
        />
      )
    }
  }

  return props.items.map((item) => {
    return (
      <div className="timeline flex flex-row">
        <div className="min-w-[4rem] md:min-w-[8rem] min-h-[9rem] flex relative">
          <span className="w-[0.1rem] h-full mx-auto block bg-brand1" />
          <div className="left-1/2 transform -translate-x-1/2 absolute w-max flex flex-col text-center py-5">
            {item.year && (
              <span className="font-bold mb-2 bg-primary">{item.year}</span>
            )}
            {item.image !== undefined && renderImage(item.image, item.alt)}
            {item.title && (
              <span className="text-sm bg-primary mt-1 max-w-[5rem] md:max-w-[9rem] text-center">
                {item.title}
              </span>
            )}
          </div>
        </div>
        {item.description && (
          <div className="flex-grow items-center flex pl-5 py-5">
            {item.description}
          </div>
        )}
      </div>
    )
  })
}

export default Timeline
