import Link from 'next/link'
import { AuthModals } from "@/components/auth-modals"

export function Header() {
  return (
    <header className="border-b sticky shadow bg-white top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">TeamCollab</span>
              <div>
                <svg id="logo-33" width="160" height="46" viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M26.6046 3.72414C25.1108 2.23101 22.6895 2.2315 21.1964 3.72525L8.73506 16.1917L8.72444 16.1886L8.68506 16.1928C8.70128 16.2006 8.7172 16.2083 8.7328 16.2161C6.54682 16.4451 5.61934 17.102 5.60884 17.9456C5.61254 18.2594 5.74129 18.5983 5.97778 18.9501L5.96641 18.9615C7.95369 21.9588 17.7986 25.9127 24.7636 23.2338C19.5436 25.8438 7.25026 26.3611 3.63951 21.2935C2.85537 22.1418 2.52729 23.2566 2.65084 24.3279C3.6047 29.5853 14.2689 31.0196 24.9332 23.4023L27.2409 25.71C24.3693 28.6602 20.1276 45.7967 26.4303 43.1803C26.5798 43.0788 26.7067 42.988 26.8793 42.8574L27.1602 42.5922C27.144 42.5962 27.1279 42.6 27.1119 42.6038L43.9919 26.6681C45.5592 25.1884 45.5947 22.7065 44.0702 21.1826L26.6046 3.72414ZM24.7664 8.91743L25.3433 6.60974L25.9202 8.91743L27.651 9.49436L25.9202 10.0713L25.3433 12.379L24.7664 10.0713L23.0356 9.49436L24.7664 8.91743ZM17.6255 16.4508L18.0101 14.9123L18.3947 16.4508L19.5486 16.8354L18.3947 17.22L18.0101 18.7585L17.6255 17.22L16.4717 16.8354L17.6255 16.4508ZM31.0211 29.4277L30.6365 30.9661L29.4827 31.3508L30.6365 31.7354L31.0211 33.2738L31.4057 31.7354L32.5596 31.3508L31.4057 30.9661L31.0211 29.4277Z" className="ccustom" fill="#4845D2"></path> <path d="M54.898 12.2755H51.3159V28.4387H61.2323V25.2716H54.898V12.2755Z" className="ccustom" fill="#4845D2"></path> <path d="M61.5744 22.9563C61.5744 26.4074 63.8897 28.7008 67.3844 28.7008C70.8574 28.7008 73.1726 26.4074 73.1726 22.9563C73.1726 19.5052 70.8574 17.19 67.3844 17.19C63.8897 17.19 61.5744 19.5052 61.5744 22.9563ZM64.96 22.9345C64.96 21.2963 65.921 20.2042 67.3844 20.2042C68.826 20.2042 69.7871 21.2963 69.7871 22.9345C69.7871 24.5945 68.826 25.6866 67.3844 25.6866C65.921 25.6866 64.96 24.5945 64.96 22.9345Z" className="ccustom" fill="#4845D2"></path> <path d="M73.7137 22.7816C73.7137 26.0797 75.8543 28.3076 78.8903 28.3076C80.3538 28.3076 81.6206 27.7834 82.254 26.9316V28.4387C82.254 29.9458 81.3148 30.9506 79.6548 30.9506C78.1695 30.9506 77.143 30.2516 77.0774 29.0066H73.6701C73.9758 31.999 76.2911 34.0085 79.4582 34.0085C83.1933 34.0085 85.5522 31.584 85.5522 27.7397V17.5176H82.5161L82.3414 18.6315C81.7298 17.736 80.4411 17.1463 78.9559 17.1463C75.898 17.1463 73.7137 19.4397 73.7137 22.7816ZM77.1211 22.6942C77.1211 21.1216 78.1696 20.0731 79.5019 20.0731C81.0527 20.0731 82.1885 21.0997 82.1885 22.6942C82.1885 24.2887 81.0746 25.3808 79.5238 25.3808C78.1914 25.3808 77.1211 24.2887 77.1211 22.6942Z" className="ccustom" fill="#4845D2"></path> <path d="M86.5326 22.9563C86.5326 26.4074 88.8478 28.7008 92.3426 28.7008C95.8155 28.7008 98.1308 26.4074 98.1308 22.9563C98.1308 19.5052 95.8155 17.19 92.3426 17.19C88.8478 17.19 86.5326 19.5052 86.5326 22.9563ZM89.9181 22.9345C89.9181 21.2963 90.8792 20.2042 92.3426 20.2042C93.7842 20.2042 94.7452 21.2963 94.7452 22.9345C94.7452 24.5945 93.7842 25.6866 92.3426 25.6866C90.8792 25.6866 89.9181 24.5945 89.9181 22.9345Z" className="ccustom" fill="#4845D2"></path> <path d="M101.031 15.8139C102.079 15.8139 102.931 14.9621 102.931 13.8918C102.931 12.8215 102.079 11.9915 101.031 11.9915C99.9606 11.9915 99.1087 12.8215 99.1087 13.8918C99.1087 14.9621 99.9606 15.8139 101.031 15.8139ZM99.3271 28.4387H102.713V17.5176H99.3271V28.4387Z" className="ccustom" fill="#4845D2"></path> <path d="M104.683 33.6808H108.003V27.3466C108.637 28.1766 110.078 28.7445 111.586 28.7445C114.84 28.7445 116.806 26.2545 116.718 22.8034C116.631 19.2868 114.6 17.1681 111.564 17.1681C110.013 17.1681 108.55 17.8452 107.938 18.85L107.763 17.5176H104.683V33.6808ZM108.069 22.9781C108.069 21.34 109.161 20.2479 110.734 20.2479C112.328 20.2479 113.333 21.3618 113.333 22.9781C113.333 24.5945 112.328 25.7084 110.734 25.7084C109.161 25.7084 108.069 24.6163 108.069 22.9781Z" className="ccustom" fill="#4845D2"></path> <path d="M117.077 24.9876C117.164 27.1937 118.912 28.7226 121.664 28.7226C124.307 28.7226 126.142 27.3247 126.142 25.075C126.142 23.4587 125.18 22.3884 123.389 21.9516L121.445 21.471C120.746 21.2963 120.31 21.1216 120.31 20.5537C120.31 19.9858 120.768 19.6144 121.445 19.6144C122.21 19.6144 122.712 20.1168 122.69 20.8595H125.727C125.639 18.5879 123.914 17.1681 121.511 17.1681C119.086 17.1681 117.274 18.6097 117.274 20.7939C117.274 22.2574 118.082 23.4587 120.244 24.0266L122.166 24.5289C122.734 24.6818 122.974 24.9439 122.974 25.3153C122.974 25.8613 122.472 26.2108 121.62 26.2108C120.637 26.2108 120.113 25.7521 120.113 24.9876H117.077Z" className="ccustom" fill="#4845D2"></path> <path d="M131.29 28.7226C132.623 28.7226 133.955 28.1111 134.632 27.2155L134.851 28.4387H138.018V17.5176H134.654V23.1966C134.654 24.8347 134.173 25.7303 132.623 25.7303C131.421 25.7303 130.635 25.1842 130.635 23.1529V17.5176H127.271V24.376C127.271 26.9753 128.713 28.7226 131.29 28.7226Z" className="ccustom" fill="#4845D2"></path> <path d="M143.352 28.4387V22.4758C143.352 20.641 144.335 20.1168 145.296 20.1168C146.366 20.1168 147.065 20.7721 147.065 22.1263V28.4387H150.385V22.4758C150.385 20.6192 151.346 20.095 152.307 20.095C153.377 20.095 154.098 20.7502 154.098 22.1263V28.4387H157.375V21.2963C157.375 18.8063 156.064 17.1463 153.246 17.1463C151.674 17.1463 150.385 17.9108 149.817 19.0902C149.162 17.9108 148.026 17.1463 146.213 17.1463C145.012 17.1463 143.898 17.6923 143.243 18.566L143.112 17.5176H139.966V28.4387H143.352Z" className="ccustom" fill="#4845D2"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M45.2918 5.25128C41.6831 5.25128 38.2608 6.85419 35.9505 9.62649L27.7315 19.4894L32.4775 12.3703L24.5995 15.7466C23.599 16.1754 23.348 17.4789 24.1176 18.2486L26.6528 20.7837L25.3584 22.337L28.2061 25.1846L29.7593 23.8902L32.2945 26.4254C33.0641 27.195 34.3677 26.944 34.7964 25.9436L38.1727 18.0656L31.0537 22.8116L40.9166 14.5925C43.6889 12.2823 45.2918 8.86 45.2918 5.25128ZM37.4609 13.0824C38.2472 13.8687 39.5221 13.8687 40.3085 13.0824C41.0948 12.296 41.0948 11.0211 40.3085 10.2348C39.5221 9.44841 38.2472 9.44841 37.4609 10.2348C36.6745 11.0211 36.6745 12.296 37.4609 13.0824Z" className="ccompli2" fill="#A3A2FF"></path> <path opacity="0.6" d="M3.54793 21.1609C5.43339 27.6207 16.8966 27.2839 24.7614 23.2348C19.495 25.8664 7.03695 26.369 3.54793 21.1609Z" fill="#424242"></path> <path opacity="0.6" d="M26.4303 43.1803C21.1195 45.3849 23.2955 33.5645 25.8299 28.0245C23.9825 32.9487 22.4055 43.8038 27.1602 42.5922L26.8793 42.8574C26.7067 42.988 26.5798 43.0788 26.4303 43.1803Z" fill="#424242"></path> </svg>
              </div>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <AuthModals />
          </div>
        </div>
      </div>
    </header>
  )
}

