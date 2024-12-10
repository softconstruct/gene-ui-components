import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Logo.scss";

interface ILogoProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Logo component props interface
}

/**
 * A logo component displays a Gene UI’s emblem or trademark, serving as a visual representation. It reinforces brand identity and recognition, typically placed in prominent locations such as the header, footer, or login page of an application or website.
 */
const Logo: FC<ILogoProps> = ({ className }) => {
    return (
        <div className={classNames("logo", className)}>
            {/* sizes: logo__logotype_size_large // logo__logotype_size_medium // logo__logotype_size_small */}
            {/* sizes: logo__logomark_size_large // logo__logomark_size_medium // logo__logomark_size_small */}

            {/* colors: logo__logotype_color_brand // logo__logotype_color_secondary */}
            {/* colors: logo__logomark_color_brand // logo__logomark_color_secondary */}

            {/* Large logo START */}
            <div className="logo__logotype logo__logotype_size_large logo__logotype_color_brand">
                <svg className="logo__svg" viewBox="0 0 125 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="logo__path"
                        d="M12.9165 22C11.3344 22 9.87327 21.7632 8.53314 21.2896C7.21162 20.7978 6.05762 20.1056 5.07113 19.2131C4.10326 18.3206 3.34944 17.2641 2.80966 16.0437C2.26989 14.8233 2 13.4754 2 12C2 10.5246 2.26989 9.17668 2.80966 7.95628C3.34944 6.73588 4.11257 5.67942 5.09905 4.78689C6.08554 3.89435 7.24885 3.21129 8.58898 2.73771C9.94772 2.2459 11.4368 2 13.0561 2C14.9918 2 16.7135 2.31876 18.2212 2.95628C19.7474 3.59381 21.0038 4.50455 21.9903 5.68852L17.7745 9.3224C17.1602 8.63024 16.4902 8.11111 15.7643 7.76503C15.057 7.40073 14.2659 7.21858 13.3911 7.21858C12.6652 7.21858 12.0044 7.32787 11.4088 7.54645C10.8318 7.76503 10.3386 8.08379 9.92911 8.50273C9.51962 8.92168 9.2032 9.42259 8.97985 10.0055C8.75649 10.5883 8.64481 11.2532 8.64481 12C8.64481 12.7104 8.75649 13.3661 8.97985 13.9672C9.2032 14.5501 9.51962 15.051 9.92911 15.4699C10.3386 15.8889 10.8225 16.2168 11.3809 16.4536C11.9579 16.6721 12.6001 16.7814 13.3074 16.7814C14.0519 16.7814 14.7778 16.663 15.4851 16.4262C16.1924 16.1712 16.9462 15.7432 17.7465 15.1421L21.4319 19.5683C20.2407 20.3515 18.8819 20.9526 17.3557 21.3716C15.8294 21.7905 14.3497 22 12.9165 22ZM15.7084 18.7486V11.4809H21.4319V19.5683L15.7084 18.7486Z"
                    />
                    <path
                        className="logo__path"
                        d="M39.3091 10.9281H46.1603V20.006C45.2547 20.3094 44.3136 20.5529 43.3371 20.7365C42.3606 20.9122 41.2542 21 40.0179 21C38.3011 21 36.8442 20.6567 35.6473 19.9701C34.4503 19.2834 33.5407 18.2695 32.9186 16.9281C32.2965 15.5868 31.9854 13.9381 31.9854 11.982C31.9854 10.1457 32.3319 8.55689 33.0249 7.21557C33.7258 5.87425 34.7456 4.83633 36.0843 4.1018C37.4309 3.36726 39.0729 3 41.0101 3C41.9236 3 42.8253 3.0998 43.7151 3.2994C44.605 3.499 45.4122 3.75848 46.1367 4.07784L44.92 7.0479C44.3924 6.77645 43.7899 6.5489 43.1127 6.36527C42.4355 6.18164 41.7267 6.08982 40.9865 6.08982C39.9234 6.08982 38.998 6.33732 38.2106 6.83233C37.4309 7.32734 36.8246 8.02196 36.3914 8.91617C35.9662 9.80239 35.7536 10.8483 35.7536 12.0539C35.7536 13.1956 35.9071 14.2096 36.2143 15.0958C36.5214 15.9741 37.0057 16.6647 37.6672 17.1677C38.3287 17.6627 39.191 17.9102 40.2541 17.9102C40.7738 17.9102 41.2109 17.8862 41.5653 17.8383C41.9275 17.7824 42.2661 17.7265 42.5811 17.6707V14.018H39.3091V10.9281Z"
                    />
                    <path
                        className="logo__path"
                        d="M55.4449 7.11976C56.6655 7.11976 57.7168 7.35928 58.5988 7.83832C59.4808 8.30938 60.1619 8.99601 60.6423 9.8982C61.1227 10.8004 61.3629 11.9022 61.3629 13.2036V14.976H52.8461C52.8855 16.006 53.1887 16.8164 53.7557 17.4072C54.3306 17.99 55.1259 18.2814 56.1418 18.2814C56.9844 18.2814 57.7561 18.1936 58.457 18.018C59.1579 17.8423 59.8784 17.5788 60.6187 17.2275V20.0539C59.9651 20.3812 59.2799 20.6208 58.5633 20.7725C57.8546 20.9242 56.9923 21 55.9764 21C54.6534 21 53.4801 20.7525 52.4563 20.2575C51.4404 19.7625 50.6411 19.008 50.0584 17.994C49.4835 16.98 49.1961 15.7026 49.1961 14.1617C49.1961 12.5968 49.456 11.2954 49.9757 10.2575C50.5033 9.21158 51.2357 8.42914 52.1728 7.91018C53.1099 7.38323 54.2006 7.11976 55.4449 7.11976ZM55.4685 9.71856C54.7676 9.71856 54.1849 9.94611 53.7202 10.4012C53.2635 10.8563 52.9997 11.5709 52.9288 12.5449H57.9845C57.9766 12.002 57.8782 11.519 57.6892 11.0958C57.5081 10.6727 57.2325 10.3373 56.8623 10.0898C56.5001 9.84231 56.0355 9.71856 55.4685 9.71856Z"
                    />
                    <path
                        className="logo__path"
                        d="M71.7932 7.11976C73.2028 7.11976 74.3368 7.51098 75.1952 8.29341C76.0536 9.06786 76.4827 10.3134 76.4827 12.0299V20.7605H72.88V12.9401C72.88 11.982 72.7067 11.2595 72.3602 10.7725C72.0216 10.2854 71.4861 10.0419 70.7537 10.0419C69.6512 10.0419 68.8992 10.4212 68.4976 11.1796C68.0959 11.9381 67.8951 13.0319 67.8951 14.4611V20.7605H64.2923V7.37126H67.0446L67.5289 9.08383H67.7298C68.0133 8.62076 68.3637 8.24551 68.7811 7.95808C69.2063 7.67066 69.6749 7.45908 70.1867 7.32335C70.7065 7.18762 71.242 7.11976 71.7932 7.11976Z"
                    />
                    <path
                        className="logo__path"
                        d="M85.6374 7.11976C86.858 7.11976 87.9093 7.35928 88.7913 7.83832C89.6733 8.30938 90.3544 8.99601 90.8348 9.8982C91.3152 10.8004 91.5554 11.9022 91.5554 13.2036V14.976H83.0386C83.078 16.006 83.3812 16.8164 83.9482 17.4072C84.5231 17.99 85.3184 18.2814 86.3343 18.2814C87.1769 18.2814 87.9487 18.1936 88.6495 18.018C89.3504 17.8423 90.071 17.5788 90.8112 17.2275V20.0539C90.1576 20.3812 89.4725 20.6208 88.7558 20.7725C88.0471 20.9242 87.1848 21 86.1689 21C84.8459 21 83.6726 20.7525 82.6488 20.2575C81.633 19.7625 80.8336 19.008 80.2509 17.994C79.676 16.98 79.3886 15.7026 79.3886 14.1617C79.3886 12.5968 79.6485 11.2954 80.1682 10.2575C80.6958 9.21158 81.4282 8.42914 82.3653 7.91018C83.3024 7.38323 84.3931 7.11976 85.6374 7.11976ZM85.661 9.71856C84.9601 9.71856 84.3774 9.94611 83.9128 10.4012C83.456 10.8563 83.1922 11.5709 83.1213 12.5449H88.177C88.1692 12.002 88.0707 11.519 87.8817 11.0958C87.7006 10.6727 87.425 10.3373 87.0548 10.0898C86.6926 9.84231 86.228 9.71856 85.661 9.71856Z"
                    />
                    <path
                        className="logo__path"
                        d="M115.109 3.2515V14.5808C115.109 15.7864 114.845 16.8762 114.318 17.8503C113.798 18.8164 113.007 19.5828 111.944 20.1497C110.888 20.7166 109.557 21 107.951 21C105.667 21 103.927 20.4092 102.73 19.2275C101.533 18.0459 100.934 16.481 100.934 14.5329V3.2515H104.584V13.9701C104.584 15.4152 104.876 16.4291 105.459 17.012C106.041 17.5948 106.904 17.8862 108.045 17.8862C108.849 17.8862 109.498 17.7465 109.995 17.4671C110.499 17.1876 110.869 16.7565 111.105 16.1737C111.341 15.5908 111.459 14.8483 111.459 13.9461V3.2515H115.109Z"
                    />
                    <path className="logo__path" d="M119.338 20.7605V3.2515H123V20.7605H119.338Z" />
                </svg>
            </div>
            {/* Large logo END */}
            {/* Small logo START */}
            <div className="logo__logomark logo__logomark_size_small logo__logomark_color_secondary">
                <svg className="logo__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="logo__path"
                        d="M12.9218 22C11.3389 22 9.8771 21.7632 8.53631 21.2896C7.21415 20.7978 6.05959 20.1056 5.07263 19.2131C4.10428 18.3206 3.35009 17.2641 2.81006 16.0437C2.27002 14.8233 2 13.4754 2 12C2 10.5246 2.27002 9.17668 2.81006 7.95628C3.35009 6.73588 4.11359 5.67942 5.10056 4.78688C6.08752 3.89435 7.2514 3.21129 8.59218 2.73771C9.95158 2.2459 11.4413 2 13.0615 2C14.9981 2 16.7207 2.31876 18.2291 2.95628C19.7561 3.59381 21.013 4.50455 22 5.68852L17.7821 9.3224C17.1676 8.63024 16.4972 8.11111 15.771 7.76503C15.0633 7.40073 14.2719 7.21858 13.3966 7.21858C12.6704 7.21858 12.0093 7.32787 11.4134 7.54645C10.8361 7.76503 10.3426 8.08379 9.93296 8.50273C9.52328 8.92167 9.2067 9.42259 8.98324 10.0055C8.75978 10.5883 8.64805 11.2532 8.64805 12C8.64805 12.7104 8.75978 13.3661 8.98324 13.9672C9.2067 14.5501 9.52328 15.051 9.93296 15.4699C10.3426 15.8889 10.8268 16.2168 11.3855 16.4536C11.9628 16.6721 12.6052 16.7814 13.3128 16.7814C14.0577 16.7814 14.784 16.663 15.4916 16.4262C16.1993 16.1712 16.9534 15.7432 17.7542 15.1421L21.4413 19.5683C20.2495 20.3515 18.8901 20.9526 17.3631 21.3716C15.8361 21.7905 14.3557 22 12.9218 22ZM15.7151 18.7486V11.4809H21.4413V19.5683L15.7151 18.7486Z"
                    />
                </svg>
            </div>
            {/* Small logo END */}
        </div>
    );
};

export { ILogoProps, Logo as default };
