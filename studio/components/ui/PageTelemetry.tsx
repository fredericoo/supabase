import { useStore } from 'hooks'
import { post } from 'lib/common/fetch'
import { API_URL, IS_PLATFORM } from 'lib/constants'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

const PageTelemetry: FC = ({ children }) => {
  const router = useRouter()
  const { ui } = useStore()

  useEffect(() => {
    function handleRouteChange() {
      // We want to send dynamic route path
      handlePageTelemetry(router.route)
    }

    // Listen for page changes after a navigation or when the query changes
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  useEffect(() => {
    // Send page telemetry on first page load
    // We want to send dynamic route path
    handlePageTelemetry(router.route)
  }, [])

  /**
   * send page_view event
   *
   * @param route: dynamic route path. Don't use the browser url
   * */
  const handlePageTelemetry = async (route?: string) => {
    if (IS_PLATFORM) {
      /**
       * Get referrer from browser
       */
      let referrer: string | undefined = document.referrer

      /**
       * Send page telemetry
       */
      post(`${API_URL}/telemetry/page`, {
        referrer: referrer,
        title: document.title,
        route,
        ga: {
          screen_resolution: ui.googleAnalyticsProps?.screenResolution,
          language: ui.googleAnalyticsProps?.language,
        },
      })
    }
  }

  return <>{children}</>
}

export default observer(PageTelemetry)
