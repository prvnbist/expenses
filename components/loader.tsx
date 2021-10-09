import tw from 'twin.macro'
import styled from 'styled-components'

export const Loader = (): JSX.Element => <Styles.Loader />

const Styles = {
   Loader: styled.div`
      width: 24px;
      height: 24px;
      border-radius: 50%;
      position: absolute;
      left: calc(50% - 12px);
      border-left: 4px solid #ffffff;
      animation: load8 1.1s infinite linear;
      border-top: 4px solid rgba(255, 255, 255, 0.2);
      border-right: 4px solid rgba(255, 255, 255, 0.2);
      border-bottom: 4px solid rgba(255, 255, 255, 0.2);
      &:after {
         width: 24px;
         height: 24px;
         border-radius: 50%;
      }
      @-webkit-keyframes load8 {
         0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
         }
         100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
         }
      }
      @keyframes load8 {
         0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
         }
         100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
         }
      }
   `,
}
