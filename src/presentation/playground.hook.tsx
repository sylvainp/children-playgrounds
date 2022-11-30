import { useState } from "react";
import { container } from "tsyringe";
import UsecaseResponse from "../common/usecase/usecase_response";
import PlaygroundEntity from "../domain/entities/playground.entity";
import TestedPlaygroundEntity from "../domain/entities/testedplayground.entity";
import AddPlaygroundInfoUsecase from "../domain/usecases/addPlaygroundInfo/add_playground_info.usecase";
import GetPlaygroundUsecase from "../domain/usecases/getPlayground/get_playground.usecase";
import ListAllPlaygroundsUsecase from "../domain/usecases/listAllPlaygrounds/list_all_playgrounds.usecase";

function usePlayground() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [visitedPlayground, setVisitedPlayground] =
    useState<TestedPlaygroundEntity | null>(null);
  const [allPlaygrounds, setAllPlaygrounds] = useState<
    PlaygroundEntity[] | null
  >(null);

  // const [playground, setPlayground] = useState<PlaygroundEntity | null>(null);

  const addPlaygroundInfo = async (params: {
    playgroundId: string;
    userId: string;
    comment: string;
    rate: number;
  }): Promise<void> => {
    const addPlaygroundInfoUsecase = container.resolve(
      AddPlaygroundInfoUsecase
    );
    setLoading(true);
    const response: UsecaseResponse<TestedPlaygroundEntity> =
      await addPlaygroundInfoUsecase.call({
        playgroundId: params.playgroundId,
        userId: params.userId,
        rate: params.rate,
        comment: params.comment,
        gamesId: [],
      });
    setLoading(false);
    if (response.error) {
      setError(response.error);
      setVisitedPlayground(null);
    } else {
      setError(null);
      setVisitedPlayground(response.result);
    }
  };

  const getAllPlaygrounds = async (): Promise<void> => {
    setLoading(true);
    const usecase: ListAllPlaygroundsUsecase = container.resolve(
      ListAllPlaygroundsUsecase
    );
    const result = await usecase.call();
    if (result.error) {
      setError(result.error);
      setAllPlaygrounds(null);
    } else {
      setError(null);
      setAllPlaygrounds(result.result);
    }
    setLoading(false);
  };

  // const getPlayground = async (playgroundId: string): Promise<void> => {
  //   setLoading(true);
  //   const usecase: GetPlaygroundUsecase =
  //     container.resolve(GetPlaygroundUsecase);
  //   const usecaseResult: UsecaseResponse<PlaygroundEntity | null> =
  //     await usecase.call({ playgroundId });
  //   if (usecaseResult.error) {
  //     setError(usecaseResult.error);
  //     setPlayground(null);
  //   } else {
  //     setPlayground(usecaseResult.result);
  //     setError(null);
  //   }
  //   setLoading(false);
  // };

  const getVisitedPlayground = async (
    playgroundId: string,
    userId: string
  ): Promise<void> => {
    setLoading(true);
    const usecase: GetPlaygroundUsecase =
      container.resolve(GetPlaygroundUsecase);
    const usecaseResult: UsecaseResponse<PlaygroundEntity | null> =
      await usecase.call({ playgroundId });
    if (usecaseResult.error) {
      setError(usecaseResult.error);
      setVisitedPlayground(null);
    } else {
      const testedPlayground: TestedPlaygroundEntity | undefined =
        usecaseResult.result?.getOwnTestedPlayground(userId);
      setVisitedPlayground(testedPlayground ?? null);
      setError(null);
    }
    setLoading(false);
  };

  return {
    isLoading,
    error,
    visitedPlayground,
    allPlaygrounds,
    addPlaygroundInfo,
    getAllPlaygrounds,
    getVisitedPlayground,
  };
}

export default usePlayground;
