<template>
  <div id="app">
    <div class="container">
      <h1>Vue Nice Dates</h1>
      <p class="tagline">
        A Vue version of <a href="https://github.com/hernansartorio/react-nice-dates">React nice Dates</a>. A responsive, touch-friendly, and modular date picker library.
      </p>
      <nav class="nav">
        <a href="#overview">Overview</a>
        <a href="#installation">Installation</a>
        <a href="#api-reference">API Reference</a>
        <a href="https://github.com/zhangchizi/vue-nice-dates">GitHub</a>
      </nav>
      <h2 id="overview">
        Overview
      </h2>
      <p>Vue Nice Dates is composed of a set of components and utilities with different levels of abstraction that you can use to build your own date pickers.</p>
      <p>At the top level, you have <code>DatePicker</code> and <code>DateRangePicker</code>. These are slightly-opinionated components that should cover the most common use-cases. They allow displaying date inputs with a calendar popover below. They make no assumptions about how your inputs should look, so you can render them yourself.</p>
      <p>Here's the most basic example using the <code>DatePicker</code> component:</p>
      <!-- DatePicker example -->
      <div class="example">
        <DatePickerExample />
        <VueCodeHighlight>{{ DatePickerExampleCode }}</VueCodeHighlight>
      </div>
      <p><em>Hint: you can click the header of calendar to select year and month.(<code>enableGridSwitch</code> prop)</em></p>
      <p>Here's a more complete example, this time using the <code>DateRangePicker</code> component:</p>
      <!-- DateRangePicker example -->
      <div class="example">
        <DateRangePickerExample />
        <VueCodeHighlight>{{ DateRangePickerExampleCode }}</VueCodeHighlight>
      </div>
      <h3>Customizing how the calendar appears</h3>
      <p>Next, you have <code>DatePickerCalendar</code> and <code>DateRangePickerCalendar</code>, the calendar-only date picker components (used by <code>DatePicker</code> and <code>DateRangePicker</code>). Use these if you want to display the calendars inline or implement your own popover component, for example.</p>
      <!-- DatePickerCalendar example -->
      <p><code>DatePickerCalendar</code> example:</p>
      <div class="example">
        <DatePickerCalendarExample />
        <details>
          <summary><i>Code:</i></summary>
          <VueCodeHighlight>{{ DatePickerCalendarExampleCode }}</VueCodeHighlight>
        </details>
      </div>
      <!-- DateRangePickerCalendar example-->
      <p><code>DateRangePickerCalendar</code> example:</p>
      <div class="example">
        <DateRangePickerCalendarExample />
        <details>
          <summary><i>Code:</i></summary>
          <VueCodeHighlight>{{ DateRangePickerCalendarExampleCode }}</VueCodeHighlight>
        </details>
      </div>
      <!-- Customizing days -->
      <h3>Customizing days</h3>
      <p>Modifiers define what CSS classes are applied to each calendar day. All the components accept a <code>modifiers</code>prop—an object where each key corresponds to the modifier name, and each value corresponds to a function that receives a <code>date</code> parameter and must return a <code>boolean</code> determining whether that modifier class should apply to that particular day.</p>
      <p>The default modifiers are <code>disabled</code>, <code>selected</code>, and <code>today</code>. You can also create your own modifiers by passing a <code>modifiersClassNames</code> which will be matched to the <code>modifiers</code> object.</p>
      <div class="example">
        <ModifiersExample />
        <details>
          <summary><i>Code:</i></summary>
          <VueCodeHighlight>{{ ModifiersExampleCode }}</VueCodeHighlight>
        </details>
      </div>
      <p>What is <code>type = GRID_DAY </code>? There are three types: GRID_DAY, GRID_MONTH, GRID_YEAR. Indicate which grid the calendar displays.</p>
      <h3>Implementing your own date-picking behavior</h3>
      <p>If you need to implement a date-picking behavior not covered by the previous components, you can use the <code>Calendar</code> component directly (<code>DatePickerCalendar</code> and<code>DateRangePickerCalendar</code> are themselves wrappers around this component). It accepts callbacks for when a day is clicked or hovered, which you can then use to create modifiers to control which days are selected.</p>
      <!-- CalendarExample -->
      <div class="example">
        <CalendarExample />
        <details>
          <summary><i>Code:</i></summary>
          <VueCodeHighlight>{{ CalendarExampleCode }}</VueCodeHighlight>
        </details>
      </div>
      <!-- Localization -->
      <h3>Localization</h3>
      <p>As you might have noticed, Vue Nice Dates relies of the awesome <a href="https://date-fns.org/">date-fns</a> library as a peer dependency. All components require a <code>locale</code> prop, which must be a <a href="https://date-fns.org/v2.10.0/docs/I18n">date-fns locale object</a> of your desired language.</p>
      <div class="example">
        <LocalesExample />
        <details>
          <summary><i>Code:</i></summary>
          <VueCodeHighlight>{{ LocalesExampleCode }}</VueCodeHighlight>
        </details>
      </div>
      <!-- installation -->
      <h2 id="installation">
        Installation
      </h2>
      <p>1. Add the <code>vue-nice-dates</code> and <code>date-fns</code> packages to your dependencies.</p>
      <p>With NPM:</p>
      <VueCodeHighlight>
        npm install vue-nice-dates date-fns --save
      </VueCodeHighlight>
      <p>2. Don't forget to import the CSS in your application:</p>
      <VueCodeHighlight>
        import 'vue-nice-dates/dist/style.css'
      </VueCodeHighlight>
      <!-- Style customization -->
      <h3>Style customization</h3>
      <p>You can use and override the compiled CSS on your project:</p>
      <VueCodeHighlight language="css">
        .nice-dates-navigation, .nice-dates-day {
        &nbsp;   color: #111;
        }
        .nice-dates-popover {
        &nbsp;   box-shadow: none;
        &nbsp;   border: 1px solid #ddd;
        &nbsp;   border-radius: 2px;
        &nbsp;   max-width: 480px;
        &nbsp;   transition: none;
        }
      </VueCodeHighlight>
      <p>Or, if you’re using SASS, import the original SASS file for easier customization:</p>
      <VueCodeHighlight language="css">
        /* Existing variables and their defaults */
        $nice-dates-color-gray-dark: #333;
        $nice-dates-color-gray: #999;
        $nice-dates-color-gray-light: #ddd;
        $nice-dates-color-white: #fff;
        $nice-dates-color-accent: $nice-dates-color-gray-dark;

        $nice-dates-font-size-small: 12px;
        $nice-dates-font-size-base: 14px;
        $nice-dates-font-size-big: 16px;

        @import 'vue-nice-dates/src/style.scss';
        /* Other overrides... */
      </VueCodeHighlight>
      <!-- API Reference -->
      <h2 id="api-reference">
        API Reference
      </h2>
      <!-- API: DatePicker -->
      <h3><code>DatePicker</code></h3>
      <VueCodeHighlight>
        /* props */
        date: String, // Require .sync modifier
        initialDate: Date, // Date to initialize the calendar
        locale: Object, // required; date-fns locale object
        format: String, // Default: 'dd/MM/yyyy'
        minimumDate: Date, // Days before minimumDate will be disabled
        maximumDate: Date, // Days after maximumDate will be disabled
        modifiers: Object, // Only contains functions that receive a date and a type and return a boolean
        modifiersClassNames: Object, // See "Customizing days" above
        validator: Function // Custom date validation function. Recieves a date and must return a boolean.
      </VueCodeHighlight>
      <!-- API: DateRangePicker -->
      <h3><code>DateRangePicker</code></h3>
      <VueCodeHighlight>
        /* props */
        startDate: String, // Require .sync modifier
        endDate: String, // Require .sync modifier
        focusName: String, // Require .sync modifier; Default: START_DATE; Can be START_DATE or END_DATE; Indicates which date will be chosen
        initialDate: Date,
        locale: Object, // required
        format: String, // Default: 'dd/MM/yyyy'
        minimumDate: Date,
        maximumDate: Date,
        modifiers: Object,
        modifiersClassNames: Object
        validator: Function
      </VueCodeHighlight>
      <!-- API:DatePickerCalendar -->
      <h3><code>DatePickerCalendar</code></h3>
      <VueCodeHighlight>
        /* props */
        date: String, // Require .sync modifier
        initialDate: Date,
        locale: Object, // required
        format: String, // Default: 'dd/MM/yyyy'
        minimumDate: Date,
        maximumDate: Date,
        modifiers: Object,
        modifiersClassNames: Object
        validator: Function

        /* events */
        changeLastValidDate, // Triggered if the date is valid
      </VueCodeHighlight>
      <!-- API: DateRangePickerCalendar -->
      <h3><code>DateRangePickerCalendar</code></h3>
      <VueCodeHighlight>
        /* props */
        startDate: String, // Require .sync modifier
        endDate: String, // Require .sync modifier
        focusName: String, // Default: START_DATE; Can be START_DATE or END_DATE; Indicates which date will be chosen
        initialDate: Date, Date to initialize the calendar
        locale: Object, // required
        format: String, // Default: 'dd/MM/yyyy'
        minimumDate: Date,
        maximumDate: Date,
        modifiers: Object,
        modifiersClassNames: Object
        validator: Function

        /* events */
        clickDate,
        changeLastValidStartDate, // Triggered if the startDate is valid
        changeLastValidEndDate, // Triggered if the endDate is valid
        mouseEnterDate,
        mouseLeaveDates,
      </VueCodeHighlight>
      <!-- API: Calendar -->
      <h3><code>Calendar</code></h3>
      <VueCodeHighlight>
        /* props */
        initialDate: Date, // Date to initialize the calendar
        locale: Object, // required
        format: String, // Default: 'dd/MM/yyyy'
        minimumDate: Date,
        maximumDate: Date,
        modifiers: Object,
        modifiersClassNames: Object

        /* events */
        clickDate,
        mouseEnterDate,
        mouseLeaveDates
      </VueCodeHighlight>
      <footer>
        <div class="text-light">
          Made by <a href="https://github.com/zhangchizi/vue-nice-dates">Zhangchizi</a>
        </div>
        <div class="text-light">
          Based on <a href="https://reactnicedates.hernansartorio.com/">react-nice-dates</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import DatePickerExample from '../examples/DatePickerExample'
import DatePickerExampleCode from './examplesCode/DatePickerExample'

import DatePickerCalendarExample from '../examples/DatePickerCalendarExample'
import DatePickerCalendarExampleCode from './examplesCode/DatePickerCalendarExample'

import DateRangePickerExample from '../examples/DateRangePickerExample'
import DateRangePickerExampleCode from './examplesCode/DateRangePickerExample'

import DateRangePickerCalendarExample from '../examples/DateRangePickerCalendarExample'
import DateRangePickerCalendarExampleCode from './examplesCode/DateRangePickerCalendarExample'

import ModifiersExample from '../examples/ModifiersExample'
import ModifiersExampleCode from './examplesCode/ModifiersExample'

import LocalesExample from '../examples/LocalesExample'
import LocalesExampleCode from './examplesCode/LocalesExample'

import CalendarExample from '../examples/CalendarExample'
import CalendarExampleCode from './examplesCode/CalendarExample'

export default {
  name: 'App',
  components: {
    VueCodeHighlight,
    DatePickerExample,
    DatePickerCalendarExample,
    DateRangePickerCalendarExample,
    DateRangePickerExample,
    ModifiersExample,
    LocalesExample,
    CalendarExample
  },
  data () {
    return {
      DatePickerExampleCode,
      DatePickerCalendarExampleCode,
      DateRangePickerExampleCode,
      DateRangePickerCalendarExampleCode,
      ModifiersExampleCode,
      LocalesExampleCode,
      CalendarExampleCode
    }
  }
}
</script>

<style lang="scss">
  @import "./style";
</style>
