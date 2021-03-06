import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllTasks } from '../../actions/taskAction';
import { getTasksCount } from '../../actions/taskAction';
import { dateEpx } from '../../actions/taskAction';
import { toggleLike, doExplore } from '../../actions/taskAction';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import FilterMenu from './filters/FilterMenu';
import { Input } from 'reactstrap';
import '../../style/task.css';
import FeedCard from './subs/FeedCard';
import TaskCard from './subs/TaskCard';

const ExploreTasks = props => {
  const [data, setData] = useState({
    pageNo: 1,
    current_segment: 0,
    segment_size: 3,
    search_query: '',
    sort_by: -1,
    skills_filter: [],
    location_filter: [],
    industry_filter: [],
    first_time: true
  });

  const fetchFilters = () => {
    const explored_filters = {
      c: data.current_segment,
      z: data.segment_size,
      s: data.search_query,
      r: data.sort_by,
      k: data.skills_filter,
      l: data.location_filter,
      i: data.industry_filter
    };
    return explored_filters;
  };

  // replacement of component did mount hook
  useEffect(() => {
    if (data.first_time) {
      let filters = fetchFilters();
      props.doExplore(filters, false);
      //console.log(filters);
      document.addEventListener('scroll', trackScrolling);
    }
  }, [data]);

  let updateFeed = () => {
    let filters = fetchFilters();
    filters.c = filters.c + 1;
    props
      .doExplore(filters)
      .then(() => {
        setData(prevData => ({
          ...data,
          current_segment: prevData.current_segment + 1,
          first_time: false
        }));
      })
      .then(() => {
        document.addEventListener('scroll', trackScrolling);
      });
  };

  let trackScrolling = () => {
    const wrappedElement = document.getElementById('explore-container');
    if (isBottom(wrappedElement)) {
      document.removeEventListener('scroll', trackScrolling);
      updateFeed();
    }
  };
  //   if (props.task.tasks.length < 1 && !props.task.loading) {
  //     props.getAllTasks(0);
  //   }
  const allTasks = props.task.tasks;

  const heartClick = (e, id) => {
    if (document.getElementById(e.target.id).classList.contains('far')) {
      document.getElementById(e.target.id).classList.remove('far');
      document.getElementById(e.target.id).classList.add('fas');
    } else {
      document.getElementById(e.target.id).classList.remove('fas');
      document.getElementById(e.target.id).classList.add('far');
    }
    props.toggleLike(id);
  };

  const preHeartFun = likes => {
    const { auth } = props;
    var i;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      i = 'fas';
    } else {
      i = 'far';
    }
    return i;
  };

  const alltasksDOM = [];
  // allTasks.map((tsk, i) => (
  //   <div className='task-entry mb-1' key={tsk._id}>
  //     <div className='task-entry-body'>
  //       <div id='task-statement'>{tsk.headline}</div>
  //       <div id='task-details'>
  //         {tsk.description} (<a href='#!'>more</a>)
  //       </div>
  //       <a href='#!' className='task-more-options'>
  //         <i className='fa fa-ellipsis-v' aria-hidden='true' />
  //       </a>
  //       <div className='row mt-2'>
  //         <div className='col-sm-8'>
  //           {tsk.skills.map((skl, index) => (
  //             <div className='task-category' key={tsk._id + index}>
  //               {skl}
  //             </div>
  //           ))}
  //         </div>
  //         <div id={tsk._id + 'dateexplore'} className='col-sm-4 task-date'>
  //           <div>{dateEpx(tsk.date)}</div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className='task-footer'>
  //       <span className='task-fav'>
  //         <i
  //           onClick={e => heartClick(e, tsk._id)}
  //           id={tsk._id + 'heart'}
  //           className={preHeartFun(tsk.likes) + ' fa-heart fa-fw'}
  //         />
  //       </span>
  //       <button className='btn task-hire-btn'>Send Proposal</button>
  //       <div className='task-points'>
  //         {tsk.taskpoints} <span className='task-points-curr'>TP</span>
  //       </div>
  //       <div className='task-rating'>
  //         <i className='fas fa-star fa-fw' />
  //         <i className='fas fa-star fa-fw' />
  //         <i className='fas fa-star fa-fw' />
  //         <i className='fas fa-star-half-alt' />
  //         <i className='far fa-star fa-fw' />
  //         <span className='rating-info'>(25 reviews)</span>
  //       </div>
  //     </div>
  //   </div>
  // ));

  const onPageButtonClick = e => {
    if (e.target.id === 'pageinationbtndec') {
      if (data.pageNo === 1) return;
      setData({ ...data, pageNo: data.pageNo - 1 });
      props.getAllTasks(10, (data.pageNo - 2) * 10); // updates on refresh so will not have been updated by then
    } else if (e.target.id === 'pageinationbtninc') {
      setData({ ...data, pageNo: data.pageNo - 1 + 2 }); // strange javascript behaviour
      props.getAllTasks(10, data.pageNo * 10);
    } else {
      setData({ ...data, pageNo: e.target.value });
      props.getAllTasks(10, (e.target.value - 1) * 10);
    }
  };

  const pageButtons = tButtons => {
    var btns = [];
    btns.push(
      <button
        id={'pageinationbtndec'}
        key='pageinationbtndec'
        value='dec'
        onClick={onPageButtonClick}
        className='btn m-1'
      >
        &lt;
      </button>
    );
    var i;
    for (i = 1; i <= tButtons; i++) {
      btns.push(
        <button
          id={'pageinationbtn' + i}
          key={'pageinationbtn' + i}
          value={i}
          onClick={onPageButtonClick}
          className='btn m-1'
        >
          {i}
        </button>
      );
    }
    btns.push(
      <button
        id={'pageinationbtninc'}
        key={'pageinationbtninc'}
        value='inc'
        onClick={onPageButtonClick}
        className='btn m-1'
      >
        &gt;
      </button>
    );
    return btns;
  };

  const paginations = tasksPerPage => {
    const totalButtons = Math.ceil(props.task.tasksCount / tasksPerPage);

    if (totalButtons === 0) return;

    const btns = pageButtons(totalButtons);

    return (
      <div className='text-center'>
        <div className='btn-group'>{btns}</div>
      </div>
    );
  };

  const onSearch = e => {
    setData({
      ...data,
      search_query: e.target.value
    });
  };

  const isBottom = el => {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  return (
    <div>
      <FilterMenu />

      <div className='container explore-container' id='explore-container'>
        <div className='search-container'>
          <Input
            type='search'
            name='search'
            id='exampleSearch'
            placeholder='search tasks'
            className='task-search-box'
            value={data.search_query}
            onChange={onSearch}
          />
        </div>

        <div className='task-list-section'>
          <div className='task-list-title'>Top new jobs on Taskbarter</div>
          <div className='task-list-container'>
            <FeedCard />
            {allTasks.map((task, i) => (
              <TaskCard task={task} key={i} />
            ))}

            {'fetching ' + data.current_segment}
          </div>
        </div>
      </div>
      {/* <div className='card card-body'>
        <div className='tasks-heading'>All Tasks</div>

        <div className='tasks-entries pt-2'>{alltasksDOM}</div>
        {paginations(10)}
      </div> */}
    </div>
  );
};

ExploreTasks.propTypes = {
  task: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getAllTasks: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  getTasksCount: PropTypes.func.isRequired,
  doExplore: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  task: state.task,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getAllTasks,
  toggleLike,
  getTasksCount,
  doExplore
})(ExploreTasks);
