import { html, LitElement, css } from 'lit';

export class UrWcCarousel extends LitElement {
  /**
   * @property slides public property expecting array.
   * @property autoRotation public property to initialize default autoRotation. Default false
   * @property timeInterval public property to set up time interval. Default 5000ms
   * @returns {{autoRotation: {reflect: boolean, type: BooleanConstructor}, slides: {type: ArrayConstructor}, timeInterval: {type: NumberConstructor}}}
   */
  static get properties() {
    return {
      slides: { type: Array },
      autoRotation: { type: Boolean, reflect: true },
      timeInterval: { type: Number },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
        }

        .carousel {
          background-color: #eee;
          max-width: 900px;
        }

        .carousel .carousel-inner {
          position: relative;
        }

        .carousel .carousel-items.focus {
          padding: 2px;
          border: solid 3px #005a9c;
        }

        .carousel .carousel-item {
          display: none;
          height: auto;
          max-width: 900px;
          position: relative;
          overflow: hidden;
        }

        .carousel .carousel-item.active {
          display: block;
        }
      `,
    ];
  }

  constructor() {
    super();
    /* Initialization of private properties
    @private_property __slides [Array]: Reconstructed array of slides, Private array is to add properties
                        configuration which might be missing in public api, such as aria-label.
    @private_property __currentSlideIndex [Number]: Tracks down index of current slide needs to be visible.
                        default : 0, first slide.
    @private_property __totalSlides [Number]: Tracks the number of slides present.
    */
    this.autoRotation = false;
    this.timeInterval = 5000;
    this.__initializeSlides();
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.__addEventListenerNext();
    this.__addEventListenerPrevious();
    this.__addEventListenerRotation();
    this.__handleSlideChange();
  }

  /**
   *
   * @private
   * (Temporarily for Demo), setting up static map of slides
   * Should take @property [slides] and check if information is missing
   * For example: dynamic aria-label, if missing.
   * Also, sets up __currentSlideIndex, __totalSlides
   */
  __initializeSlides() {
    this.__slides = [
      {
        url: '../demo/resources/slide-1.jpeg',
        alt: 'Cats Crossing Road',
      },
      {
        url: '../demo/resources/slide-2.jpeg',
        alt: 'Cats In Fish Market',
      },
      {
        url: '../demo/resources/slide-3.jpeg',
        alt: 'Cats On Caribbean',
      },
    ];
    this.__totalSlides = this.__slides.length;
    this.__currentSlideIndex = 0;
  }

  __addEventListenerNext() {
    const nextButtonNode = this.shadowRoot?.querySelector(
      '.carousel .controls button.next'
    );
    if (nextButtonNode)
      nextButtonNode.addEventListener('click', () =>
        this.__handleNextButtonClick()
      );
  }

  __addEventListenerPrevious() {
    const previousButtonNode = this.shadowRoot?.querySelector(
      '.carousel .controls button.previous'
    );
    if (previousButtonNode)
      previousButtonNode.addEventListener('click', () =>
        this.__handlePreviousButtonClick()
      );
  }

  __addEventListenerRotation() {
    const rotationButtonNode = this.shadowRoot?.querySelector(
      '.carousel .controls button.rotation'
    );
    if (rotationButtonNode)
      rotationButtonNode.addEventListener('click', () =>
        this.__handleRotationButtonClick()
      );
  }

  __nextCurrentSlideIndex() {
    if (this.__totalSlides) {
      this.__currentSlideIndex =
        this.__currentSlideIndex === this.__totalSlides - 1
          ? 0
          : this.__currentSlideIndex + 1;
    }
  }

  __previousCurrentSlideIndex() {
    if (this.__totalSlides) {
      this.__currentSlideIndex =
        this.__currentSlideIndex === 0
          ? this.__totalSlides - 1
          : this.__currentSlideIndex - 1;
    }
  }

  __handleSlideChange() {
    const carouselItems = this.shadowRoot?.querySelectorAll(
      '.carousel .carousel-items div.carousel-item'
    );
    if (carouselItems) {
      carouselItems.forEach((carouselItem, index) => {
        if (index === this.__currentSlideIndex) {
          carouselItem.classList.add('active');
        } else {
          carouselItem.classList.remove('active');
        }
      });
    }
  }

  __handleNextButtonClick() {
    this.__nextCurrentSlideIndex();
    this.__handleSlideChange();
  }

  __handlePreviousButtonClick() {
    this.__previousCurrentSlideIndex();
    this.__handleSlideChange();
  }

  __playRotation() {
    this.rotationIntervalHandler = setInterval(
      () => this.__handleNextButtonClick(),
      this.timeInterval
    );
  }

  __pauseRotation() {
    if (this.rotationIntervalHandler)
      clearInterval(this.rotationIntervalHandler);
  }

  __handleRotationButtonClick() {
    if (this.autoRotation) this.__pauseRotation();
    else this.__playRotation();
    this.autoRotation = !this.autoRotation;
  }

  render() {
    // TODO: DevelopmentPurposeOnly - Images have been put under "/_site-dev/_merged_assets/carousel".
    return html`
      <div
        class="carousel"
        aria-roledescription="carousel"
        aria-label="Cats are Social"
      >
        <div class="carousel-inner">
          <div class="carousel-items" aria-live="off">
            ${this.__slides.map(
              slide => html`
                <div class="carousel-item">
                  <img src="${slide.url}" alt="${slide.alt}" />
                </div>
              `
            )}
          </div>
          <div class="controls">
            <button class="previous" aria-label="Previous Slide">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 320 512"
              >
                <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"
                />
              </svg>
            </button>
            <button class="rotation pause" aria-label="Toggle Slide Rotation">
              ${this.autoRotation
                ? html`<svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    viewBox="0 0 320 512"
                  >
                    <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                      d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
                    />
                  </svg>`
                : html`<svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    viewBox="0 0 384 512"
                  >
                    <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                      d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                    />
                  </svg>`}
            </button>
            <button class="next" aria-label="Next Slide">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 320 512"
              >
                <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
