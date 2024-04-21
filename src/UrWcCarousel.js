import { html, LitElement, css } from 'lit';
// import { LionButton } from '@lion/ui/button.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

export class UrWcCarousel extends ScopedElementsMixin(LitElement) {
  // static get scopedElements() {
  //   return {
  //     'lion-button': LionButton,
  //   };
  // }

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
          // Standard was max-height: 400px;
          height: auto;
          max-width: 900px;
          position: relative;
          overflow: hidden;
          width: 100%;
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
        url: '/_merged_assets/carousel/cats_crossing_road.jpeg',
        alt: 'Cats Crossing Road',
      },
      {
        url: '/_merged_assets/carousel/cats_in_fish_market.jpeg',
        alt: 'Cats In Fish Market',
      },
      {
        url: '/_merged_assets/carousel/cats_on_caribbean.jpeg',
        alt: 'Cats On Caribbean',
      },
    ];
    this.__totalSlides = this.__slides.length;
    this.__currentSlideIndex = 0;
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
            <button
              class="previous"
              aria-label="Previous Slide"
              onclick="${this.__handlePreviousButtonClick}"
            >
              Previous
            </button>
            <button
              class="rotation pause"
              aria-label="Toggle Slide Rotation"
              onclick="${this.__handleRotationButtonClick}"
            >
              ${this.autoRotation ? 'Pause' : 'Play'}
            </button>
            <button
              class="next"
              aria-label="Next Slide"
              onclick="${this.__handleNextButtonClick}"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
